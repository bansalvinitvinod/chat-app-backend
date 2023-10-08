const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING, allowNull: false, unique: true
    },
    email: {
        type: DataTypes.STRING, allowNull: false
    },
    password: {
        type: DataTypes.STRING, allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN, allowNull: false
    }
});

module.exports = User;