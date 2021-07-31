const { userIsBanned } = require("./helpers/discord-helpers.js");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    var user_id = event.queryStringParameters.user_id
    if (user_id !== undefined) {
        if (process.env.REACT_APP_GUILD_ID) {
            if (!await userIsBanned(user_id, process.env.REACT_APP_GUILD_ID)) {
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
