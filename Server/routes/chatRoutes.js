const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/conversations', chatController.getConversations);
router.post('/chat', chatController.sendMessage);

module.exports = router;
