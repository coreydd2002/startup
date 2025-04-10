import React, { useState, useEffect } from 'react';
import './pals.css';

export function Play() {
  const [pals, setPals] = useState([]); // Initialize pals as an empty array
  const [currentPal, setCurrentPal] = useState(""); // No default pal
  const [currentID, setCurrentID] = useState(""); // Initialize currentID as an empty string
  const [messages, setMessages] = useState({}); // Initialize messages as an empty object
  const [messageInput, setMessageInput] = useState("");
  const [chat_id, setchatId] = useState([]);// =========================
  const [tokens, setTokens] = useState([]);
  const [newMessage, setNewMessage] = useState(""); 

  useEffect(() => {
    const fetchPals = async () => {
      try {
        const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
        const response = await fetch(`/api/chats?user=${loggedInUser}`); // Pass the user's email as a query parameter
        if (response.ok) {
          const data = await response.json();
          setPals(data.map((chat) => chat.chatName)); // Populate pals with chat names
          setTokens(data.map((chat) => chat.token)); // Store chat tokens
          setchatId(data.map((chat) => chat._id)); // Store chat IDs
        } else {
          console.error("Failed to fetch pals");
        }
      } catch (err) {
        console.error("Error fetching pals:", err);
      }
    };
  
    fetchPals();
  }, []);


  // Function to add a new numbered pal
  const addNewPal = async () => {
    try {
      const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
      console.log("Logged-in user:", loggedInUser); // Debugging log
  
      const response = await fetch('/api/chats/createOrJoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: loggedInUser }), // Pass the logged-in user's email
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Chat response:", data); // Debugging log
  
        // Update the pals list with the new or joined chat
        const newPalName = data.chatName; // Use the chat name from the backend
        if (!pals.includes(newPalName)) {
          setPals((prevPals) => [...prevPals, newPalName]); // Add the new chat to the pals list
        }
  
        // Optionally, set the new chat as the current pal
        setCurrentPal(newPalName);
      } else if (response.status === 400) {
        const data = await response.json();
        alert(data.msg); // Show the error message from the backend
      } else {
        console.error("Failed to create or join chat:", response.statusText);
      }
    } catch (err) {
      console.error("Error in addNewPal:", err);
    }
  };

  ///////////////////////////////////////
  const sendMessage = async (messageContent) => {
    const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
    const index = pals.indexOf(currentPal);
    const token = tokens[index]; // Get the token of the selected chat
  
    if (!loggedInUser) {
      alert("Missing user");
      return;
    }
    if (!token) {
      alert("Missing chat");
      return;
    }
    if (!messageContent) {
      alert("Missing message content");
      return;
    }
  
    try {
      const response = await fetch('/api/chats/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, message: messageContent, user: loggedInUser }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Message sent successfully:", data.message);
  
        // Do not update the messages state here, as WebSocket will handle it
        setNewMessage(""); // Clear the input field
      } else {
        console.error("Failed to send message:", response.statusText);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };



  // Function to delete the current pal
  const deleteChat = async () => {
    const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
    const chatId = currentID; // Use the current chat ID
  
    if (!loggedInUser || !chatId) {
      alert("No user or chat selected");
      return;
    }
  
    try {
      const response = await fetch('/api/chats/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: loggedInUser, chatId }),
      });
  
      if (response.ok) {
        console.log("User replaced with NULL successfully");
        // Optionally, update the frontend state
        setCurrentPal(""); // Clear the current pal
        setMessages([]); // Clear the messages
        setPals((prevPals) => prevPals.filter((pal) => pal !== currentPal)); // Remove the pal from the list
      } else {
        console.error("Failed to delete user:", response.statusText);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000'); // Replace with your server's WebSocket URL
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      if (data.type === 'newMessage') {
        // Handle new message
        if (data.chatId === currentID) {
          setMessages((prevMessages) => [...prevMessages, data.message]);
        }
      } else if (data.type === 'userDeleted') {
        // Handle user deletion
        if (data.chatId === currentID) {
          setCurrentPal("");
          setMessages([]);
        }
      } else if (data.type === 'chatCreated') {
        // Handle new chat creation
        const loggedInUser = localStorage.getItem('userName');
        if (data.user1 === loggedInUser && !pals.includes(data.chatName)) {
          setPals((prevPals) => [...prevPals, data.chatName]);
          setTokens((prevTokens) => [...prevTokens, data.chatId]);
        }
      } else if (data.type === 'chatJoined') {
        // Handle chat join
        if (!pals.includes(data.chatName)) {
          setPals((prevPals) => [...prevPals, data.chatName]);
          setTokens((prevTokens) => [...prevTokens, data.chatId]);
        }
      }
    };
  
    return () => {
      ws.close(); // Clean up WebSocket connection on component unmount
    };
  }, [currentID, pals, tokens]);

  return (
    <main className="bg-secondary">

      {/* Pals List */}
      <div className="pals">
        <span className="pal-list">Your Pals</span>
        <div className="text-strings">
          {pals.length === 0 ? (
            <p className="no-pals-message">You have no current pals... let's change that!</p>
          ) : (
            pals.map((pal, index) => (
              <button
                key={index}
                onClick={async () => {
                  setCurrentPal(pal); // Update the current pal's name
                  const token = tokens[index]; 
                  setCurrentID(chat_id[index]); // Use the index from the map loop
                  console.log("Current Chat ID:", chat_id[index]);
                  console.log("Current Token:", token);
                
                try {
                  const response = await fetch(`/api/chats/messages/${token}`);
                  if (response.ok) {
                    const fetchedMessages = await response.json();
                    setMessages(fetchedMessages); // Update the messages state
                  } else {
                    console.error(`Failed to fetch messages for token ${token}`);
                  }
                  } catch (err) {
                  console.error(`Error fetching messages for token ${token}:`, err);
                }}}

                className={`pal-button ${currentPal === pal ? "active-pal" : ""}`}
              >
                {pal}
              </button>
            ))
          )}
        </div>
      </div>

  
{/* Chat Section */}
<div className="chat-container">
  {currentPal ? (
    <>
      <div className="message-display" id="chat">
        <div className="messages">
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const isMe = message.sender === localStorage.getItem('userName'); // Check if the message is from the logged-in user
              return (
                <div key={index} className={`message ${isMe ? "me" : "them"}`}>
                  {message.content}
                </div>
              );
            })
          ) : (
            <p className="no-pals-message">No messages yet. Start the conversation!</p>
          )}
        </div>
      </div>

      <div className="input-area">
        <input
          type="text"
          id="messageInput"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(newMessage)} // Allow pressing Enter to send
        />
        <button id="sendButton" onClick={() => sendMessage(newMessage)}>Send</button>
      </div>
    </>
  ) : (
    <div className="blank-chat">
      <p className="no-chat-selected">No chat selected</p>
    </div>
  )}
</div>


  
      {/* Options Section */}
      <div className="options-container">
        <div>
          <button className="options-button" onClick={addNewPal}>➕ New Chat</button>
        </div>
        <div>
          <button className="options-button" onClick={deleteChat}>➖ Delete Chat</button>
        </div>
        <div>
          <button className="options-button" id="Report">⚠️ Report</button>
        </div>
      </div>
    </main>
  );
};
