const express = require('express');
const { addMessageToChat } = require('./database'); // Import addMessageToChat
const router = express.Router();

// Endpoint to send a message
router.post('/api/messages/send', async (req, res) => {
  const { chatId, sender, text } = req.body; // Use chatId, sender, and text
  try {
    const timestamp = new Date();
    const message = { sender, text, timestamp };

    // Use addMessageToChat to add the message to the chat
    const result = await addMessageToChat(chatId, message);
    if (result.modifiedCount === 0) {
      return res.status(404).send("Chat not found");
    }

    res.status(200).send("Message sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message");
  }
});

// Endpoint to get messages between two users
router.get('/messages', async (req, res) => {
  const userEmail = req.query.user; // Get the logged-in user's email from the query parameter

  try {
    // Fetch messages where the user is either user1 or user2
    const messages = await DB.getMessagesByUser(userEmail);
    res.status(200).send(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send({ msg: 'Failed to fetch messages' });
  }
});

module.exports = router;
