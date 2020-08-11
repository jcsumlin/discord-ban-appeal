const axios = require("axios")

function userIsBanned(userId, guildId, botToken) {

    var config = {
        method: 'get',
        url: `https://discord.com/api/v6/guilds/${encodeURIComponent(guildId)}/bans/${encodeURIComponent(userId)}`,
        headers: {
            'Authorization': `Bot ${botToken}`,
            'Cookie': '__cfduid=d593767d468b7548ad579dc31781b3a101597176898; __cfruid=c124033110a13645fb4a09a2d239403b5bcd1564-1597176898'
        }
    };
    var result = axios(config)
        .then(function (response) {
            if (response.status === 200) {
                return true
            } else return false;
        })
        .catch(function (error) {
            console.log(error);
        });
    return result
}

module.exports = { userIsBanned };