const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { unbanUser } = require("./helpers/discord-helpers.js");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        if (unbanInfo.userId !== undefined) {
            try {
                await unbanUser(unbanInfo.userId, process.env.REACT_APP_GUILD_ID, process.env.REACT_APP_DISCORD_BOT_TOKEN);

                return {
                    statusCode: 303,
                    body: JSON.stringify({success: true})
                };
            } catch (e) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "Failed to unban user, please unban manually."})
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}