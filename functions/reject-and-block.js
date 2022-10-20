const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { Octokit } = require("@octokit/core");
const {default: axios} = require("axios");
const config = require("../src/config.json")
var fs = require('fs')
var CONFIG_FILE = './src/config.json'


async function get_repo_info() {
    const repo_info = {
        username: null,
        repo: null
    }
    let regex_repo = /^https:\/\/github.com\/([A-Za-z.\-_0-9]+)\/([A-Za-z.\-_0-9]+)$/g;
    let regex_ssh_repo = /github.com:([A-Za-z.\-_0-9]+)\/([A-Za-z\-_0-9]+)/g; // For some reason Netlify can use either the HTTP or SSH url for a repo...
    let regex_result;
    if (config.repository_url.includes('git@')) {
        regex_result = regex_ssh_repo.exec(config.repository_url)
    } else {
        regex_result = regex_repo.exec(config.repository_url)
    }
    if (!regex_result) {
        throw new Error("Unable to parse repo url: " + config.repository_url)
    }
    repo_info.username = regex_result[1] 
    repo_info.repo = regex_result[2]
    return repo_info
}

async function blockUser(user_id) {
    const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
    let repo_info = await get_repo_info();
    let file = await octokit.request(`GET /repos/${repo_info.username}/${repo_info.repo}/contents/src/config.json`)
    console.log(file)
    let config_file_content = await axios({
        url: `https://raw.githubusercontent.com/${repo_info.username}/${repo_info.repo}/master/src/config.json`,
        method: 'GET',
        responseType: 'blob',
    })
    let config =  config_file_content.data
    if (config.blocked_users.includes(user_id)) {
        throw new Error("User is already blocked");
    }
    config.blocked_users.push(user_id);
    try {
        await octokit.request(`PUT /repos/${repo_info.username}/${repo_info.repo}/contents/src/config.json`, {
            message: 'User Blocked by API',
            content: Buffer.from(JSON.stringify(config)).toString('base64'),
            sha: file.data.sha
        })
    } catch (e) {
        throw new Error("Failed to update /src/config.json: " + e.message)
    }

}

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }
    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.user_id !== undefined) {
            try {
                console.log(process.env.NETLIFY);
                if (process.env.NETLIFY === true) {
                    await blockUser(unbanInfo.user_id);
                } else {
                    // Local Development Github Spoof
                    console.log(unbanInfo)
                    if (config.blocked_users.includes(unbanInfo.user_id)) {
                        throw new Error("User is already blocked");
                    }
                    config.blocked_users.push(unbanInfo.user_id)
                    let string_data = JSON.stringify(config);
                    fs.writeFileSync(CONFIG_FILE, string_data);
                }
                return {
                    statusCode: 302,
                    headers: {"Location": `/success?msg=${encodeURIComponent("User blocked successfully!")}`}
                };
            } catch (e) {
                let message;
                console.log(e) // Logging request errors for better debugging. Dont worry this only shows up in your Netlify function console.
                if (e.message.includes("credentials")) {
                    message = "Bad Github Credentials. Check your GITHUB_PAT and redeploy."
                } else {
                    message = e.message
                }
                return {
                    statusCode: 302,
                    headers: {"Location": `/error?msg=${encodeURIComponent(message)}`}
                };
            }
        }
    }
    return {
        statusCode: 400
    };
}
