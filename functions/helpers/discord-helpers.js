const fetch = require("node-fetch");

function callBanApi(userId, guildId, botToken, method) {
    return fetch(`https://discord.com/api/v6/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`, {
        method: method,
        headers: {
            "Authorization": `Bot ${botToken}`
        }
    });
}

async function userIsBanned(userId, guildId, botToken) {
    let result = await callBanApi(userId, guildId, botToken, "GET")
    if (!result.ok && result.status !== 404) {
        throw new Error("Failed to get user");
    }
    return result.ok;
}

async function unbanUser(userId, guildId, botToken) {
    const result = await callBanApi(userId, guildId, botToken, "DELETE");

    if (!result.ok && result.status !== 404) {
        throw new Error("Failed to unban user");
    }
}

module.exports = { userIsBanned };