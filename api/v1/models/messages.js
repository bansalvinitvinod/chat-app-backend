const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING, allowNull: false
    }
});

module.exports = Message;