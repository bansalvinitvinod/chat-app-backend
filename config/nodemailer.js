const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
        user: process.env.MAILUSER,
        pass: process.env.MAILPASSWORD
    }
});

module.exports = transport;