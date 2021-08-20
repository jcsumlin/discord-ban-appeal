const axios = require("axios");
const {decodeJwt} = require("./helpers/jwt-helpers");
const config = require("../src/config.json")
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
            statusCode: 403,
            body: JSON.stringify({message: "User is blocked"})
        }
    }
    let data = JSON.parse(event.body)
    var url = process.env.REACT_APP_WEBHOOK_URL;
    const now = new Date();
    var embed = [{
        title: "New Ban Appeal Received",
        type: "rich",
        author: {
            name: unbanInfo.username,
            icon_url: unbanInfo.avatar_url ? unbanInfo.avatar_url : "https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png"
        },
        fields: [],
        description: `**Username**: <@${unbanInfo.user_id}> (${unbanInfo.username}#${unbanInfo.user_discriminator})\n
         **Actions**\n[Approve appeal and unban user](${data.unban_url}?token=${encodeURIComponent(event.headers.authorization)})`,
        timestamp: now.toISOString()
    }];
    for (let i = 0; i < data.form.length; i++) {
        let question = data.form[i].question;
        let answer = data.form[i].answer;
        embed[0].fields.push({name: `**${question}**`, value: answer, inline: false});
    }

    return await axios.post(url, {embeds: embed})
        .then(() => {
            return {
                statusCode: 200,
                body: JSON.stringify({success: true})
            };
        })
        .catch(err => {
            return {
                statusCode: 500,
                body: JSON.stringify({success: false, error: "There was a problem sending your request to the set discord webhook. Please contact and admin or open a support ticket."})
            };
        })
}
