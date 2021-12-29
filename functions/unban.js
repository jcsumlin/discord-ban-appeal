const { decodeJwt } = require("./helpers/jwt-helpers.js");
const { unbanUser } = require("./helpers/discord-helpers.js");
const sendGridMail = require("@sendgrid/mail");


async function sendUnbanEmail(usersInfo, url) {
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const html = `
      <div> 
         Hi ${usersInfo.username}#${usersInfo.user_discriminator}! <br>
         Your ban appeal request submitted on ${url} has been approved!<br>
         You are now able to rejoin us using this invite ${process.env.INVITE_URL}
      </div>
    `;
    const mail = {
        from: process.env.SENDGRID_SENDER_EMAIL,
        to: usersInfo.email,
        subject: "Your Ban Appeal Was Approved!",
        html,
    };
    await sendGridMail.send(mail);
}

exports.handler = async function (event, context) {
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405
        };
    }

    if (event.queryStringParameters.token !== undefined) {
        const unbanInfo = decodeJwt(event.queryStringParameters.token);
        console.log(unbanInfo)
        if (unbanInfo.user_id !== undefined) {
            try {
                // let guild = await getGuildInfo(process.env.REACT_APP_GUILD_ID);
                let response = await unbanUser(unbanInfo.user_id, process.env.REACT_APP_GUILD_ID);
                if (response.response && response.response.data.code === 10026) {
                    throw new Error("User is not actually banned")
                }
                if (process.env.REACT_APP_ENABLE_SENDGRID) {
                    await sendUnbanEmail(unbanInfo, event.headers.host)
                }
                return {
                    statusCode: 302,
                    headers: {"Location": "/success/unban"}
                };
            } catch (e) {
                return {
                    statusCode: 302,
                    headers: {"Location": `/error/unban?msg=${encodeURIComponent(e.message)}`}
                };
            }
        }
    }
    return {
        statusCode: 400
    };
}
