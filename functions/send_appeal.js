const axios = require("axios");
const {decodeJwt} = require("./helpers/jwt-helpers");
const config = require("../src/config.json")
const {MAX_EMBED_FIELD_CHARS} = require("./helpers/discord-helpers");
const {API_ENDPOINT} = require("./helpers/discord-helpers");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405
        };
    }
    try {
        var unbanInfo = decodeJwt(event.headers.authorization);
    } catch (e) {
        return {
            statusCode: 403,
            body: JSON.stringify({message: e.message})
        }
    }
    // Authorized
    if (config.blocked_users.includes(unbanInfo.user_id)) {
        return {
            statusCode: 302,
            headers: {"Location": `/error?msg=${encodeURIComponent("User is blocked")}`}
        };
    }
    let data = JSON.parse(event.body)
    console.log(data)
    if (process.env.REACT_APP_ENABLE_HCAPTCHA === "true") {
        try {
            const params = new URLSearchParams();
            params.append('secret', process.env.REACT_APP_HCAPTCHA_SECRET_KEY);
            params.append('response', data.hCaptcha.token);
            // let hCaptchaData = {'secret': process.env.REACT_APP_HCAPTCHA_SECRET_KEY, 'response': data.hCaptcha.token}
            let response = await axios.post("https://hcaptcha.com/siteverify", params)
            if (!response.data.success) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "Captcha failed verification"})
                };
            }
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: "Captcha failed verification", error_message: e.message})
            };
        }
    }

    var appeal_channel_id = process.env.APPEALS_CHANNEL;
    var body = {
        embed: {
            title: "New Ban Appeal Received",
            description: `**Username**: <@${unbanInfo.user_id}> (${unbanInfo.username}#${unbanInfo.user_discriminator})`,
            author: {
                name: unbanInfo.username,
                icon_url: unbanInfo.avatar_url ? unbanInfo.avatar_url : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
            },
            fields: [],
            timestamp: new Date().toISOString()
        }
    };
    for (let i = 0; i < data.form.length; i++) {
        let question = data.form[i].question;
        let answer = data.form[i].answer.slice(0, MAX_EMBED_FIELD_CHARS);
        body.embed.fields.push({name: `**${question}**`, value: answer, inline: false});
    }
    body.components = [{
        type: 1,
        components: [
            {
                type: 2,
                style: 5,
                label: "Approve and Unban",
                url: `${data.unban_url}?token=${encodeURIComponent(event.headers.authorization)}`
            },
            {
                type: 2,
                style: 5,
                label: "Deny and Block",
                url: `${data.deny_and_block_url}?token=${encodeURIComponent(event.headers.authorization)}`
            },
        ]
    }]
    console.log("Discord webhook body")
    console.log(body)

    return await axios.post(`${API_ENDPOINT}/channels/${encodeURIComponent(appeal_channel_id)}/messages`,
        body,
        {
            headers: {
                'Content-Type': "application/json",
                "Authorization": `Bot ${process.env.REACT_APP_DISCORD_BOT_TOKEN}`
            }
        })
        .then((res) => {
            console.log(res.data)
            return {
                statusCode: 200,
                body: JSON.stringify({success: true})
            };
        })
        .catch(err => {
            console.log(err)
            return {
                statusCode: 500,
                body: JSON.stringify({
                    success: false,
                    error: "Failed to post message to appeals channel using bot token. Please contact and admin or open a ticket here https://github.com/jcsumlin/discord-ban-appeal/issues/new?template=bug_report.md",
                })
            };
        })
}
