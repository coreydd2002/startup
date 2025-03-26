const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');
const { v4: uuidv4 } = require('uuid');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('penpal');
const userCollection = db.collection('user');
const messageCollection = db.collection('messages');


function generateChatName() {
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Gray', 
    'Black', 'White', 'Pink', 'Brown', 'Gold', 'Silver', 'Copper', 'cyan', 'Magenta', 
    'Lime', 'Teal', 'Indigo', 'Violet', 'Amber', 'Azure', 'Beige', 'Coral', 'Crimson', 
    'Lavender', 'Maroon', 'Olive', 'Plum', 'Salmon', 'Turquoise', 'mustard', 'Peach'];
  const animals = ['Tiger', 'Owl', 'Eagle', 'Lion', 'Bear', 'Wolf', 'Fox', 'Hawk', 
    'Panther', 'Raven', 'Deer', 'Coyote', 'Moose', 'Rabbit', 'Squirrel', 'Badger',
    'Raccoon', 'Bobcat', 'Cougar', 'Jaguar', 'Leopard', 'Cheetah', 'Hyena',  'Wallaby',
    'chicken', 'Duck', 'Goose', 'Turkey', 'Pheasant', 'Quail', 'Partridge', 'Peacock',
    'Penguin', 'Ostrich', 'Emu', 'Kiwi', 'Cassowary', 'Rhea', 'Albatross', 'Pelican',
    'Heron', 'Stork', 'Flamingo', 'Ibis', 'Spoonbill', 'Vulture', 'Egret', 'Condor',
    'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Dog', 'Cat', 'Giraffe', 'panda', 'Koala', 
    'Kangaroo', 'Wombat', 'Platypus'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `${randomColor} ${randomAnimal}`;
}


// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

async function addUser(user) {
  await userCollection.insertOne(user);
}

async function updateUser(user) {
  await userCollection.updateOne(
    { email: user.email }, 
    { $set: user }
  );
}


// Function to find an open-ended message (no user2 assigned)
async function findOpenMessage() {
  try {
    const openMessage = await messageCollection.findOne({ user2: null });
    return openMessage;
  } catch (err) {
    console.error("Error in findOpenMessage:", err);
    throw err;
  }
}

async function assignUserToMessage(messageId, user2) {
  try {
    await messageCollection.updateOne(
      { _id: messageId },
      { $set: { user2 } }
    );
  } catch (err) {
    console.error("Error in assignUserToMessage:", err);
    throw err;
  }
}

// Function to create a new message collection with user1 assigned
async function createMessage(user1) {
  try {
    const customId = uuidv4(); // Generate a unique ID for the chat
    const initialChatName = "Searching for a new pal..."; // Temporary chat name
    const result = await messageCollection.insertOne({
      _id: customId, // Use the custom ID
      user1,
      user2: null,
      chatName: initialChatName, // Set the initial chat name
      messages: [], // Initialize with an empty messages array
    });
    console.log("New message created:", result); // Debugging log
    return { id: result.insertedId, chatName: initialChatName };
  } catch (err) {
    console.error("Error in createMessage:", err);
    throw err;
  }
}

// Function to assign user2 to an open-ended message
async function assignUserToMessage(messageId, user2) {
  try {
    const chatName = generateChatName(); // Generate a random chat name
    await messageCollection.updateOne(
      { _id: messageId },
      { $set: { user2, chatName } } // Update user2 and chatName
    );
    console.log(`User2 added and chat name updated to: ${chatName}`);
  } catch (err) {
    console.error("Error in assignUserToMessage:", err);
    throw err;
  }
}


// Function to add a message between two users
async function addMessage(user1, user2, message) {
  await messageCollection.updateOne(
    { user1, user2 },
    { $push: { messages: message } },
    { upsert: true }
  );
}

// Function to get messages between two users
async function getMessage(user1, user2) {
  const chat = await messageCollection.findOne({ user1, user2 });
  return chat ? chat.messages : [];
}


async function getMessagesByUser(userEmail) {
  try {
    const messages = await messageCollection.find({
      $or: [{ user1: userEmail }, { user2: userEmail }]
    }).toArray();
    console.log("Filtered messages for user:", userEmail, messages); // Debugging log
    return messages;
  } catch (err) {
    console.error("Error in getMessagesByUser:", err);
    throw err;
  }
}

async function getChatByUser(userEmail) {
  try {
    return await messageCollection.findOne({
      $or: [{ user1: userEmail }, { user2: userEmail }],
    });
  } catch (err) {
    console.error("Error in getChatByUser:", err);
    throw err;
  }
}

async function findOpenMessage() {
  try {
    return await messageCollection.findOne({ user2: null });
  } catch (err) {
    console.error("Error in findOpenMessage:", err);
    throw err;
  }
}

async function addMessageToChat(chatId, message) {
  try {
    return await messageCollection.updateOne(
      { _id: chatId },
      { $push: { messages: message } } // Append the message to the messages array
    );
  } catch (err) {
    console.error("Error in addMessageToChat:", err);
    throw err;
  }
}

module.exports = {
  getUser,
  getUserByToken,
  addUser,
  updateUser,  
  addMessage,
  getMessage,
  findOpenMessage,
  createMessage,
  assignUserToMessage,
  getMessagesByUser,
  getChatByUser,
  findOpenMessage,
  addMessageToChat,
};
