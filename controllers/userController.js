const mongoose = require('mongoose');
const { google } = require('googleapis');
const serverSetup = require('../utilites/setupServerUtilities');
const jwt = require('jsonwebtoken');
const logger = require('../utilites/logger');

const User = require('../modals/user');

let jwtSecretKey = process.env.JWT_SECRET_KEY;

exports.verify = async (req, res) => {
    let decoded = jwt.verify(req.params.jwt, jwtSecretKey);
    try {
        let user = await User.find({ email: decoded.email });
        if (user) {
            let updatedUser = await User.findOneAndUpdate({ email: decoded.email }, { $set: { verified: true } }, { new: true });
            if (updatedUser.verified) {
                res.json({ status: 'success', message: 'Email verified' });
                logger.info(`Email verification complete for ${decoded.email}`);
            } else {
                res.json({ status: 'failed', message: 'Email was not verified. some issue with the database update.' });
                logger.error(`UpdatedUser info for ${decoded.email} was empty`);
            }
        }
    } catch (err) {
        logger.error(`${err.name} ${err.message}`);
        res.status(500).json({ status: 'failed', message: `Some error occured ${err.message}` });
    }
}

exports.register = async (req, res) => {
    let data = { email: req.body.to };
    const jwtToken = jwt.sign(data, jwtSecretKey);

    // logger.info(`Sending email to ${req.body.to}`);
    // const emailRes = await serverSetup.mailTransporter.sendMail({
    //     from: process.env.SMTP_EMAIL,
    //     to: req.body.to,
    //     subject: req.body.subject,
    //     html: `
    //     <div style=" font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    //         Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
    //         Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji; background-color: #eee;padding:1rem;">

    //             <div style="width: 60%; min-width: 200px; margin: auto;">
    //                 <div style="background-color: white;">

    //                     <div style="background-color: #091841;color:white;  text-align: center;padding:1rem; font-size: 2rem;">
    //                         JBroker
    //                     </div>
    //                     <div style="padding:1rem">
    //                         <h2 style="color: #2b4458; text-align: center;">Thank you for registering in JBroker</h2>
    //                         <p>You're only a step away from getting your own stock tracker. To confirm your account, click the claim
    //                             button or follow below URL.</p>
    //                         <div style="text-align: center;">
    //                             <a href="https://ascoupon.herokuapp.com"
    //                                 style="text-decoration: none; background-color: #091841; color: white; padding: 10px 30px; border-radius: 50px; display: inline-block;">
    //                                 Claim your personalized tracker</a><br />
    //                             <a href="http://localhost">http://localhost:3002/verify/${jwtToken}</a>
    //                         </div>

    //                     </div>
    //                 </div>
    //                 <div>
    //                     <p style="font-size: 0.7rem;">This app is still in the alpha stage and is not yet available for use. Please
    //                         do not use if you have not been contacted directly by <b>Jayesh</b>. If you believe you received this
    //                         email as mistake, please reply to this email with the message <i>mistake</i> and we will take care of
    //                         it.</p>
    //                 </div>

    //             </div>
    //         </div>
    //     `,
    // });   
    // logger.info(`Google's response for email: ${emailRes.response}`);
    try {
        let user = await User.findOne({ email: req.body.to });
        if (user) {
            res.json({ status: 'failed', message: 'Email already in use' });
        } else {

            let newUser = new User({ email: req.body.to });
            let u = await newUser.save();
            res.json({});
            // res.json({accepted:emailRes.accepted, rejected: emailRes.rejected, response: emailRes.response});
        }
    } catch (err) {
        logger.error(`Unable to register user. ${err.name} ${err.message}`);
    }
    console.log(`${process.env.SERVER_URL}/api/user/verify/${jwtToken}`);
}

exports.updatePin = async (req, res) => {
    let email;
    try{
        let jwtToken = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
        email = jwtToken.email;
        logger.info(`updating pin using token for ${req.body.email}`);
    }catch(err){
        email = req.body.email;
        logger.info(`Updating pin using email in req.body for ${req.body.email}`);
    }
    try{
        let user = await User.findOneAndUpdate({ email: email }, { $set: { pin: req.body.pin }}, { new: true });
        if(user){
            res.json({status: 'success', message:'Pin updated.'});
            logger.info(`Pin updated for ${req.body.email}`);
        }else{
            res.status(404).json({status: 'failed', message:'User not found.'});
            logger.info(`Pin update failed for ${req.body.email} as user object is null.`);
        }
    }catch(err){
        logger.error(`${err.name} ${err.message}`);
        res.status(500).json({ status: 'failed', message: `Some error occured ${err.message}` });
    }
}