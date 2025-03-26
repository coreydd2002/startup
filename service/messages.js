const express = require('express');
const { addMessage, getMessages } = require('./database');
const router = express.Router();

// Endpoint to send a message
router.post('/api/messages/send', async (req, res) => {
  const { user1, user2, message } = req.body;
  try {
    await addMessage(user1, user2, message);
    res.status(200).send("Message sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message");
  }
});

// Endpoint to get messages between two users
apiRouter.get('/messages', async (req, res) => {
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