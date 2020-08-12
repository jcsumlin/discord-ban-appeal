const { userIsBanned } = require("./helpers/discord-helpers.js");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }


    return fetch(`https://discord.com/api/v6/guilds/742174778462437459/bans/742850882298970247`, {
        method: "GET",
        headers: {
            "Authorization": `Bot ${process.env.REACT_APP_DISCORD_BOT_TOKEN}`
        }
    });


    var user_id = event.queryStringParameters.user_id
    if (user_id !== undefined) {
        if (process.env.REACT_APP_GUILD_ID && !process.env.REACT_APP_SKIP_BAN_CHECK) {
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
