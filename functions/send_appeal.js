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
            icon_url: unbanInfo.avatar_url
        },
        description: `**Username**: <@${unbanInfo.user_id}> (${unbanInfo.username}#${unbanInfo.user_discriminator})\n` +
            "**Why were you banned?**\n" + data.ban_reason + "\n\n" +
            "**Why do you feel you should be unbanned?**\n" + data.unban_reason + "\n\n" +
            "**What will you do to avoid being banned in the future?**\n" + data.future_behavior + "\n\n " +
            "**Actions**\n" +
            `[Approve appeal and unban user](${data.unban_url}?token=${encodeURIComponent(event.headers.authorization)})`,
        timestamp: now.toISOString()
    }];
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
                body: JSON.stringify({success: false, error: err.message})
            };
        })
}
