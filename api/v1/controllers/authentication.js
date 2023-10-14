const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { User, Role, Capability } = require("../models");
const { Op } = require("sequelize");
const transport = require('../../../config/nodemailer');

exports.signup = async (req, res) => {

    User.create({
        username: req.body.username,
        email: req.body.email,
        passwordText: bcrypt.hashSync(req.body.passwordText, 8),
        status: true,
        RoleId: 2
    }).then(newUser => {

        User.findOne({
            where: {
                username: req.body.username
            },
            include: {
                model: Role,
                include: {
                    model: Capability
                }
            }
        }).then(user => {
            if (!user) {
                return res.status(404)
                    .send({
                        accessToken: null,
                        message: "User Not found."
                    });
            }

            //signing token with user id
            var token = genertateJWTToken(user);

            //responding to client request with user profile success message and  access token .
            res.status(201).send({
                accessToken: token,
                message: "User registered successfully"
            })
        }).catch((error) => {
            console.error('Failed to retrieve data : ', error);
            res.status(500).send({
                message: error
            });
            return;
        });
    }).catch(error => {
        console.error('Failed to create a new record : ', error);
        res.status(500).send({
            message: error.errors[0].message
        });
    });

}

exports.signin = (req, res) => {

    User.findOne({
        where: {
            username: req.body.username,
            status: true
        },
        attributes: ['id', 'username', 'email', 'passwordText'],
        include: {
            model: Role,
            attributes: ['id', 'name'],
            include: {
                model: Capability,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }
        }
    }).then(user => {
        if (!user) {
            return res.status(404)
                .send({
                    accessToken: null,
                    message: "User Not found."
                });
        }

        //comparing passwords
        var passwordIsValid = bcrypt.compareSync(
            req.body.passwordText,
            user.passwordText
        );

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        // removing password
        delete user.dataValues.passwordText;

        //signing token with user details
        var token = genertateJWTToken(user);

        //responding to client request with user profile success message and  access token .
        res.status(200).send({
            accessToken: token,
            message: "Login successfull",
            user: user
        });
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
        res.status(500).send({
            message: error
        });
        return;
    });

}

exports.forgotPassword = async (req, res) => {

    User.findOne({
        where: {
            email: req.body.email,
            status: true
        },
        attributes: ['id', 'email']
    }).then(user => {
        if (!user) {
            return res.status(404)
                .send({
                    accessToken: null,
                    message: "User Not found."
                });
        }

        //generate random password
        let randomPassword = generateRandomPassword(12);

        User.update(
            {
                passwordText: bcrypt.hashSync(randomPassword, 8)
            },
            {
                where: {
                    id: user.id,
                }
            }
        ).then(([rowsUpdated, [updatedUser]]) => {
            if (rowsUpdated > 0) {
                console.log('User updated successfully.');
                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: user.email,
                    subject: 'Password Reset',
                    html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Forgot Password</title>
                    </head>
                    <body>
                        <div style="background-color: #f0f0f0; padding: 20px;">
                            <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px;">
                                <h2>Forgot Password</h2>
                                <p>Hello,</p>
                                <p>You have requested a password reset for your account.</p>
                                <p>Your new password is: <strong>${randomPassword}</strong></p>
                                <p>Please use this new password to log in to your account.</p>
                                <p>If you did not request this password reset, please contact our support team immediately.</p>
                                <p>Thank you,</p>
                                <p>Your Application Team</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    `,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                        console.log(err);
                    } else {
                        console.log('Email sent: ' + info.response);
                        //responding to client request with success message.
                        res.status(200).send({
                            message: "New password sent over email"
                        });
                    }
                });
            } else {
                res.status(404).send({
                    message: "No user found or updated."
                });
            }
        }).catch((err) => {
            console.error('Error updating user:', error);
            res.status(500).send({
                message: err
            });
            return;
        });

    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
        res.status(500).send({
            message: error
        });
        return;
    });
}

function genertateJWTToken(user) {
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.Role.id,
        capabilities: user.Role.Capabilities.map(feature => feature.id)
    }, process.env.API_SECRET, {
        expiresIn: 86400
    });
}

function generateRandomPassword(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charset.length);
        password += charset.charAt(randomIndex);
    }

    return password;
}