const {getGuildInfo } = require('./helpers/discord-helpers');

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
        console.log(unbanInfo)
        if (unbanInfo.userId !== undefined) {
            try {
                // let guild = await getGuildInfo(process.env.REACT_APP_GUILD_ID);
                let response = await unbanUser(unbanInfo.userId, process.env.REACT_APP_GUILD_ID);
                // await sendUnbanEmail(unbanInfo.email, guild.name)
                if (response.response && response.response.data.code === 10026) {
                    throw new Error("User is not actually banned")
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({success: true, message: "User is successfully unbanned"})
                };
            } catch (e) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: "Failed to unban user, please unban manually.", error_message: e.message})
                };
            }
        }
    }

    return {
        statusCode: 400
    };
}
