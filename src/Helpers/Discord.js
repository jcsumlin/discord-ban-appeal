const API_ENDPOINT = "https://discord.com/api/v6";
const axios = require("axios")

function userIsBanned(userId, guildId, botToken) {
    const result = axios.get(`${API_ENDPOINT}/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`, {
        headers: {
            "Authorization": `Bot ${botToken}`
        }
    });

    return result.ok;
}

module.exports = { userIsBanned };