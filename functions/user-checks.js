const { userIsBanned } = require("./helpers/discord-helpers.js");
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    var user_id = event.queryStringParameters.user_id
    if (user_id !== undefined) {
        if (process.env.REACT_APP_GUILD_ID) {
            if (!await userIsBanned(user_id, process.env.REACT_APP_GUILD_ID, process.env.REACT_APP_DISCORD_BOT_TOKEN)) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({is_banned: false}),
                };
            }
            return {
                statusCode: 200,
                body: JSON.stringify({is_banned: true}),
            };
        }
    }
    return {
        statusCode: 400
    };
}
