const {getGuildInfo} = require("./helpers/discord-helpers");

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    try {
        let result = await getGuildInfo(process.env.REACT_APP_GUILD_ID, process.env.REACT_APP_DISCORD_BOT_TOKEN);
        return {
            statusCode: 200,
            body: JSON.stringify({success: true, guild_name: result.data.name, guild_icon: result.data.icon})
        };
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Failed to get guild"})
        };
    }
}