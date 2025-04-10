const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const authCookieName = 'token';
const WebSocket = require('ws');
const clients = new Set();
// Service port configuration
const port = process.argv.length > 2 ? process.argv[2] : 3000;
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


const wss = new WebSocket.Server({ server: httpService });
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  clients.add(ws);

  // Handle incoming messages (optional)
  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  // Handle disconnection
  ws.on('close', () => {
    console.log('WebSocket disconnected');
    clients.delete(ws);
  });
});
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Create a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await DB.updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
    DB.updateUser(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Endpoint to create or join a chat
apiRouter.post('/chats/createOrJoin', async (req, res) => {
  const { user } = req.body; // Get the logged-in user's email from the request body
  try {
    // Check if the user is already `user1` in an open-ended chat
    const openMessage = await DB.findOpenMessage();
    if (openMessage && openMessage.user1 === user) {
      return res.status(400).send({
        msg: 'You are already searching for a new chat.',
        chatId: openMessage._id,
        chatName: openMessage.chatName,
      });
    }

    if (openMessage) {
      // Assign the current user to user2 in the open message
      const chatName = await DB.assignUserToMessage(openMessage._id, user);

      // Broadcast the new chat join event
      broadcast({
        type: 'chatJoined',
        chatId: openMessage._id,
        chatName,
        user2: user,
      });

      res.status(200).send({
        msg: 'Joined existing chat',
        chatId: openMessage._id,
        chatName,
        user2: user,
      });
    } else {
      // No open message found, create a new one
      const { id: newMessageId, chatName } = await DB.createMessage(user);

      // Broadcast the new chat creation event only to the user who created it
      broadcast({
        type: 'chatCreated',
        chatId: newMessageId,
        chatName,
        user1: user,
      });

      res.status(201).send({
        msg: 'Created new chat',
        chatId: newMessageId,
        chatName,
        user2: null,
      });
    }
  } catch (err) {
    console.error("Error in createOrJoin endpoint:", err);
    res.status(500).send({ msg: 'Failed to create or join chat' });
  }
});


// Endpoint to fetch all message collections
apiRouter.get('/chats', async (req, res) => {
  const userEmail = req.query.user; // Get the logged-in user's email from the query parameter
  console.log("Fetching messages for user:", userEmail); // Debugging log
  try {
    if (!userEmail) {
      return res.status(400).send({ msg: 'User email is required' }); // Handle missing email
    }
    
    // Fetch messages where the user is either user1 or user2
    const messages = await DB.getChatByUser(userEmail);
    res.status(200).send(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send({ msg: 'Failed to fetch messages' });
  }
});

apiRouter.get('/chats/messages/:token', async (req, res) => {
  const { token } = req.params; // Extract the token from the route parameter
  console.log("Fetching messages for chat with token:", token); // Debugging log

  try {
    const chat = await DB.getChatByToken(token); // Fetch the chat using the token
    if (!chat) {
      return res.status(404).send({ msg: 'Chat not found' });
    }

    res.status(200).send(chat.messages); // Send the messages array
  } catch (err) {
    console.error("Error fetching messages by token:", err);
    res.status(500).send({ msg: 'Failed to fetch messages' });
  }
});



apiRouter.post('/chats/messages', async (req, res) => {
  const { token, message, user } = req.body;

  if (!token || !message || !user) {
    return res.status(400).send({ msg: 'Token, message, and user are required' });
  }

  try {
    const chat = await DB.getChatByToken(token);
    if (!chat) {
      return res.status(404).send({ msg: 'Chat not found' });
    }

    const newMessage = { sender: user, content: message, timestamp: new Date() };
    await DB.addMessageToChat(chat._id, newMessage);

    // Broadcast the new message to all clients
    broadcast({ type: 'newMessage', chatId: chat._id, message: newMessage });

    res.status(200).send({ msg: 'Message added successfully', message: newMessage });
  } catch (err) {
    console.error("Error adding message to chat:", err);
    res.status(500).send({ msg: 'Failed to add message to chat' });
  }
});

apiRouter.post('/chats/deleteUser', async (req, res) => {
  const { user, chatId } = req.body;

  if (!user || !chatId) {
    return res.status(400).send({ msg: 'User and chatId are required' });
  }

  try {
    const chat = await DB.getChatById(chatId);
    if (!chat) {
      return res.status(404).send({ msg: 'Chat not found' });
    }

    if (chat.user1 === user) {
      await DB.updateChatUser(chatId, 'user1', 'NULL');
    } else if (chat.user2 === user) {
      await DB.updateChatUser(chatId, 'user2', 'NULL');
    } else {
      return res.status(400).send({ msg: 'User not part of this chat' });
    }

    // Broadcast the user deletion to all clients
    broadcast({ type: 'userDeleted', chatId, user });

    res.status(200).send({ msg: 'User replaced with NULL successfully' });
  } catch (err) {
    console.error("Error deleting user from chat:", err);
    res.status(500).send({ msg: 'Failed to delete user from chat' });
  }
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Serve the default page
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Create a new user
async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await DB.addUser(user);
  return user;
}

// Find a user by field and value
async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return DB.getUserByToken(value);
  }
  return DB.getUser(value);
}


// Set authentication cookie
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

