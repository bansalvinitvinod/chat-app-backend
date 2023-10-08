const sequelize = require('../../../config/db');
const Capability = require("./capabilities");
const Role = require("./roles");
const User = require("./users");
const Chat = require("./chats");
const Message = require("./messages");

Capability.belongsToMany(Role, { through: 'Capability', timestamps: false });
Role.belongsToMany(Capability, { through: 'Capability', timestamps: false });

Role.hasMany(User, {
    onDelete: 'RESTRICT'
});
User.belongsTo(Role);

Chat.belongsTo(User, { foreignKey: 'user1Id' });
Chat.belongsTo(User, { foreignKey: 'user2Id' });

Chat.hasMany(Message);
User.hasMany(Message);
Message.belongsTo(Chat);
Message.belongsTo(User);

sequelize.sync({ force: true }).then(() => {
    console.log('Tables created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = {
    Capability,
    Role,
    User,
    Chat,
    Message
}