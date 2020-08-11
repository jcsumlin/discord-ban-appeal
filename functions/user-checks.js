const { userIsBanned } = require("./helpers/discord.js");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }
    return {
        body: event
    }
}