import React, { useState, useEffect } from 'react';
import './pals.css';

export function Play() {
  const [pals, setPals] = useState([]); // Initialize pals as an empty array
  const [currentPal, setCurrentPal] = useState(""); // No default pal
  const [messages, setMessages] = useState({}); // Initialize messages as an empty object
  const [messageInput, setMessageInput] = useState("");



  // Function to send a new message
  const sendMessage = async () => {
    if (messageInput.trim() === "") return;

    // Check if the current chat is ready (both users assigned)
    const response = await fetch(`//messages?user1=user1&user2=${currentPal}`);
    if (response.ok) {
      const chat = await response.json();
      if (!chat.user2) {
        alert("Waiting for another user to join the chat.");
        return;
      }
    } else {
      console.error("Failed to fetch chat details");
      return;
    }

    const message = { text: messageInput, sender: "user1", timestamp: new Date() };

    const sendResponse = await fetch(`/api/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user1: "user1", // Replace with the logged-in user's email
        user2: currentPal, // Assume `currentPal` holds recipient email
        message,
      }),
    });

    if (sendResponse.ok) {
      setMessages((prev) => ({
        ...prev,
        [currentPal]: [...(prev[currentPal] || []), message],
      }));
      setMessageInput("");
    } else {
      console.error("Failed to send message");
    }
  };

  useEffect(() => {
    const fetchPals = async () => {
      try {
        const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
        console.log("Fetching pals for user:", loggedInUser); // Debugging log
  
        const response = await fetch(`/api/messages?user=${loggedInUser}`); // Pass the user's email as a query parameter
        if (response.ok) {
          const data = await response.json();
          console.log("Filtered pals:", data); // Debugging log
          setPals(data.map((chat) => chat.chatName)); // Populate pals with chat names
        } else {
          console.error("Failed to fetch pals");
        }
      } catch (err) {
        console.error("Error fetching pals:", err);
      }
    };
  
    fetchPals();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`/api/messages?user1=user1&user2=${currentPal}`);
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => ({ ...prev, [currentPal]: data }));
      } else {
        console.error("Failed to fetch messages");
      }
    };

    if (currentPal) {
      fetchMessages();
    }
  }, [currentPal]);

  // Function to add a new numbered pal
  const addNewPal = async () => {
    try {
      const loggedInUser = localStorage.getItem('userName'); // Retrieve the logged-in user's email
      console.log("Logged-in user:", loggedInUser); // Debugging log
  
      const response = await fetch('/api/messages/createOrJoin', {
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
        setPals((prevPals) => [...prevPals, newPalName]); // Add the new chat to the pals list
  
        // Optionally, set the new chat as the current pal
        setCurrentPal(newPalName);
      } else {
        console.error("Failed to create or join chat:", response.statusText);
      }
    } catch (err) {
      console.error("Error in addNewPal:", err);
    }
  };

  // Function to delete the current pal
  const deleteChat = () => {
    const updatedPals = pals.filter((pal) => pal !== currentPal); // Remove current pal
    const newMessages = { ...messages };
    delete newMessages[currentPal];

    setPals(updatedPals);
    setMessages(newMessages);

    // Switch to the first pal, or set to an empty string if no pals remain
    setCurrentPal(updatedPals[0] || "");
  };

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
                onClick={() => setCurrentPal(pal)}
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
        <div className="message-display" id="chat">
          <span className="current-pal">{currentPal}</span>
  
          {/* Display messages for the selected pal */}
          {messages[currentPal]?.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
  
        <div className="input-area">
          <input
            type="text"
            id="messageInput"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button id="sendButton" onClick={sendMessage}>Send</button>
        </div>
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
