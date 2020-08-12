const axios = require("axios");

async function callBanApi(userId, guildId, botToken, method) {
    let config = {
        method: method,
        url: `https://discord.com/api/v6/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`,
        headers: {
            'Authorization': `Bot ${botToken}`,
        }
    };
    return axios(config)
        .then((response) => {
            return response;
        }).catch(() => {
            return false
        })
}

async function userIsBanned(userId, guildId, botToken) {
    let result = await callBanApi(userId, guildId, botToken, "GET")
    return result;
}

async function unbanUser(userId, guildId, botToken) {
    const result = await callBanApi(userId, guildId, botToken, "DELETE");

    if (!result.ok && result.status !== 404) {
        throw new Error("Failed to unban user");
    }
}

module.exports = { userIsBanned, unbanUser };