const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../../config/db');

const Capability = sequelize.define('Capability', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING, allowNull: false
    }
});

module.exports = Capability;