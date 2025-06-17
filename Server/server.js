const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

// Import models so Sequelize knows about them
require('./models/Conversation');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({ alter: true }); // sync models, update tables if needed
        console.log('Models synchronized');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();
