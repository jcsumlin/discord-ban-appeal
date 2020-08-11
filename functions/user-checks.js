const { userIsBanned } = require("./helpers/discord-helper.js");

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