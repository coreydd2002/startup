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
  if (!chatId || !sender || !text) {
    return res.status(400).send({ msg: "Missing required fields" });
  }
});

// Endpoint to get messages between two users
router.get('/api/messages/:chatId', async (req, res) => {
  const { chatId } = req.params; // Get the chatId from the URL
  try {
    const chat = await DB.getChatById(chatId); // Fetch the chat by chatId
    if (!chat) {
      return res.status(404).send({ msg: 'Chat not found' });
    }
    res.status(200).send(chat.messages); // Send only the messages array
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send({ msg: 'Failed to fetch messages' });
  }
});

router.get('/api/chats/:chatName', async (req, res) => {
  const { chatName } = req.params; // Get the chatName from the URL
  try {
    const chat = await messageCollection.findOne({ chatName }); // Query by chatName
    if (!chat) {
      return res.status(404).send({ msg: 'Chat not found' });
    }
    res.status(200).send(chat); // Send the entire chat object
  } catch (err) {
    console.error("Error fetching chat details:", err);
    res.status(500).send({ msg: 'Failed to fetch chat details' });
  }
});

module.exports = router;
