const fetch = require("node-fetch");

const API_ENDPOINT = "https://discord.com/api/v6";

function callBanApi(userId, guildId, botToken, method) {
    return fetch(`${API_ENDPOINT}/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`, {
        method: method,
        headers: {
            "Authorization": `Bot ${botToken}`
        }
    });
}

async function userIsBanned(userId, guildId, botToken) {
    return (await callBanApi(userId, guildId, botToken, "GET")).ok;
}

async function unbanUser(userId, guildId, botToken) {
    const result = await callBanApi(userId, guildId, botToken, "DELETE");

    if (!result.ok && result.status !== 404) {
        throw new Error("Failed to unban user");
    }
}

module.exports = { userIsBanned, unbanUser };