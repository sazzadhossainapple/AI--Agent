const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define(
    'Conversation',
    {
        client_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        agent_id: {
            type: DataTypes.STRING, // NEW FIELD
            allowNull: true,
        },
        sender: {
            type: DataTypes.ENUM('client', 'agent'),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps: true, // ✅ now Sequelize will use createdAt and updatedAt
        tableName: 'conversations',
    }
);

module.exports = Conversation;
