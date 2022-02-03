const { google } = require('googleapis');
const serverSetup = require('../utilites/setupServerUtilities');
const jwt = require('jsonwebtoken');
const logger = require('../utilites/logger');

exports.verify = (req, res) => {
    console.log(req.params.jwt);
    res.json('called');
}

exports.register = async (req, res) => {
    let jwtSecretKey = "process.env.JWT_SECRET_KEY";
    let data = { email: req.body.to };
    const jwtToken = jwt.sign(data, jwtSecretKey);

    logger.info(`Sending email to ${req.body.to}`);
    const emailRes = await serverSetup.mailTransporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: req.body.to,
        subject: req.body.subject,
        html: `
        <div style=" font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
            Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; background-color: #eee;padding:1rem;">

                <div style="width: 60%; min-width: 200px; margin: auto;">
                    <div style="background-color: white;">

                        <div style="background-color: #091841;color:white;  text-align: center;padding:1rem; font-size: 2rem;">
                            JBroker
                        </div>
                        <div style="padding:1rem">
                            <h2 style="color: #2b4458; text-align: center;">Thank you for registering in JBroker</h2>
                            <p>You're only a step away from getting your own stock tracker. To confirm your account, click the claim
                                button or follow below URL.</p>
                            <div style="text-align: center;">
                                <a href="https://ascoupon.herokuapp.com"
                                    style="text-decoration: none; background-color: #091841; color: white; padding: 10px 30px; border-radius: 50px; display: inline-block;">
                                    Claim your personalized tracker</a><br />
                                <a href="http://localhost">http://localhost:3002/verify/${jwtToken}</a>
                            </div>

                        </div>
                    </div>
                    <div>
                        <p style="font-size: 0.7rem;">This app is still in the alpha stage and is not yet available for use. Please
                            do not use if you have not been contacted directly by <b>Jayesh</b>. If you believe you received this
                            email as mistake, please reply to this email with the message <i>mistake</i> and we will take care of
                            it.</p>
                    </div>

                </div>
            </div>
        `,
    });   
    logger.info(`Google's response for email: ${emailRes.response}`);
    res.json({accepted:emailRes.accepted, rejected: emailRes.rejected, response: emailRes.response});
}