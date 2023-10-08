var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var { User, Role, Capability } = require("../models");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        status: true,
        RoleId: 2
    }).then(newUser => {
        res.status(200).send({
            message: "User registered successfully"
        })
    }).catch(error => {
        console.error('Failed to create a new record : ', error);
        res.status(500).send({
            message: error
        });
    });

};

exports.signin = (req, res) => {

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

        //comparing passwords
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        //signing token with user id
        var token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.Role.id,
            capabilities: user.Role.Capabilities.map(feature => feature.id)
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });

        //responding to client request with user profile success message and  access token .
        res.status(200).send({
            accessToken: token,
            message: "Login successfull",
        });
    }).catch((error) => {
        console.error('Failed to retrieve data : ', error);
        res.status(500).send({
            message: error
        });
        return;
    });

};