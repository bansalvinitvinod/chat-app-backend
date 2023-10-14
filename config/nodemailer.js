const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
        user: process.env.MAILPORT,
        pass: process.env.MAILPORT
    }
});

module.exports = transport;