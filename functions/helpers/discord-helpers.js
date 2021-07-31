const axios = require("axios");

const instance = {
    baseURL: 'https://discord.com/api/v9',
    headers: {
        'Authorization': `Bot ${process.env.REACT_APP_DISCORD_BOT_TOKEN}`,
    }
}

async function callBanApi(userId, guildId, method) {
    let config = {
        baseURL: instance.baseURL,
        headers: instance.headers,
        method: method,
        url: `/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`
    }
    return axios(config)
        .then((response) => {
            return response;
        }).catch((e) => {
            if (e.response && e.response.data.code === 10026) {
                console.log("User is not banned")
            }
            console.log(e.message)
            return e
        })
}

async function userIsBanned(userId, guildId) {
    let result = await callBanApi(userId, guildId, "GET")
    return result;
}

async function unbanUser(userId, guildId) {
    const result = await callBanApi(userId, guildId, "DELETE");
    if (result === false) {
        throw new Error("Failed to unban user");
    }
    return result
}

async function getGuildInfo(guildId) {
    return await callGuildApi(guildId, "GET")
}

async function callGuildApi(guildId, method) {
    let config = {
        baseURL: instance.baseURL,
        headers: instance.headers,
        method: method,
        url: `/guilds/${encodeURIComponent(guildId)}`
    }
    return axios(config)
        .then((response) => {
            return response.data;
        }).catch((e) => {
            console.log("error", e.message);
            return false
        })
}

// async function sendUnbanDM(userId, guild_name) {
//     await createDM(userId)
//         .then((res) => {
//             let config = {
//                 baseURL: instance.baseURL,
//                 headers: instance.headers,
//                 method: "POST",
//                 url: `/channels/${res.id}/messages`,
//                 data: {
//                     embed: {
//                         title: `Your appeal has been approved.`,
//                         description: `You may now rejoin ${guild_name}`,
//                         color: 3066993
//                     }
//                 }
//             };
//             return axios(config)
//                 .then((response) => {
//                     return response.data;
//                 }).catch((e) => {
//                     console.log("getting here")
//                     throw new Error(e)
//                 })
//         })
// }

// async function createDM(userId) {
//     let config = {
//         baseURL: instance.baseURL,
//         headers: instance.headers,
//         method: "POST",
//         url: `/users/@me/channels`,
//         data:  {recipient_id: userId}
//     }
//     return axios(config)
//         .then((response) => {
//             return response.data;
//         }).catch((e) => {
//             throw new Error(e)
//         })
// }


module.exports = {userIsBanned, unbanUser, getGuildInfo};
