const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { Octokit } = require("@octokit/core");
const {default: axios} = require("axios");

async function get_repo_info() {
    let regex_repo = /^https:\/\/github.com\/(?<username>[A-Za-z.\-_0-9]+)\/(?<repo>[A-Za-z.\-_0-9]+)$/g;
    let repo_info = regex_repo.exec(process.env.REPOSITORY_URL)
    if (repo_info.groups === undefined) {
        throw new Error("Unable to parse repo url: " + process.env.REPOSITORY_URL)
    }
    return repo_info.groups
}

async function blockUser(user_id) {
    const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
    let repo_info = await get_repo_info();
    let file = await octokit.request(`GET /repos/${repo_info.username}/${repo_info.repo}/contents/src/config.json`)
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
            content: btoa(JSON.stringify(config)),
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
                await blockUser(unbanInfo.user_id);
                return {
                    statusCode: 302,
                    headers: {"Location": `/success?msg=${encodeURIComponent("User blocked successfully!")}`}
                };
            } catch (e) {
                return {
                    statusCode: 302,
                    headers: {"Location": `/error?msg=${encodeURIComponent(e.message)}`}
                };
            }
        }
    }
    return {
        statusCode: 400
    };
}
