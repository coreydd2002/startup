const cookieParser = require('cookie-parser');
const bcrypt = require('./node_modules/bcryptjs/umd/index.js');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// Service port configuration
const port = process.argv.length > 2 ? process.argv[2] : 3000;

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
apiRouter.post('/messages/createOrJoin', async (req, res) => {
  const { user } = req.body; // Get the logged-in user's email from the request body

  try {
    // Check if the user is already `user1` in an open-ended chat
    const openMessage = await DB.findOpenMessage();
    if (openMessage && openMessage.user1 === user) {
      return res.status(400).send({
        msg: 'Hold your horses! You are already on the search for a new pal.',
        chatId: openMessage._id,
        chatName: openMessage.chatName,
      });
    }

    // Check for an open-ended message collection (user2 is null)
    if (openMessage) {
      // Assign the current user to user2 in the open message
      const chatName = await DB.assignUserToMessage(openMessage._id, user); // Ensure this returns the updated chat name
      res.status(200).send({
        msg: 'Joined existing chat',
        chatId: openMessage._id,
        chatName, // Return the updated chat name
        user2: user,
      });
    } else {
      // No open message found, create a new one
      const { id: newMessageId, chatName } = await DB.createMessage(user);
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

apiRouter.post('/messages/send', async (req, res) => {
  const { chatId, sender, text } = req.body; // Get the chat ID, sender, and message text from the request body

  try {
    // Add the message to the chat's messages array
    const timestamp = new Date();
    const message = { sender, text, timestamp };

    const result = await DB.addMessageToChat(chatId, message);
    if (result.modifiedCount === 0) {
      return res.status(404).send({ msg: 'Chat not found' });
    }

    res.status(200).send({ msg: 'Message sent successfully', message });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).send({ msg: 'Failed to send message' });
  }
});

// Endpoint to fetch all message collections
apiRouter.get('/messages', async (req, res) => {
  const userEmail = req.query.user; // Get the logged-in user's email from the query parameter
  console.log("Fetching messages for user:", userEmail); // Debugging log

  try {
    if (!userEmail) {
      return res.status(400).send({ msg: 'User email is required' }); // Handle missing email
    }

    // Fetch messages where the user is either user1 or user2
    const messages = await DB.getMessagesByUser(userEmail);
    res.status(200).send(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).send({ msg: 'Failed to fetch messages' });
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


const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
