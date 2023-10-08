const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Chat;