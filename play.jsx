import React, { useState, useEffect } from 'react';
import './pals.css';

export function Play() {
  // Load pals from localStorage or use default pals
  const [pals, setPals] = useState(() => {
    return JSON.parse(localStorage.getItem("pals")) || ["Blue Tiger", "Red Eagle", "Navy Owl"];
  });

  const [currentPal, setCurrentPal] = useState(pals[0]); // Default to first pal
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatMessages")) || {};
  });

  const [messageInput, setMessageInput] = useState(""); 

  // Save pals and messages to localStorage
  useEffect(() => {
    localStorage.setItem("pals", JSON.stringify(pals));
  }, [pals]);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Function to send a new message
  const sendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessages = {
      ...messages,
      [currentPal]: [...(messages[currentPal] || []), { text: messageInput, sender: "user1" }]
    };

    setMessages(newMessages);
    setMessageInput("");
  };

  // Function to add a new numbered pal
  const addNewPal = () => {
    const newPalNumber = pals.filter(pal => pal.startsWith("New Chat")).length + 1;
    const newPalName = `New Chat ${newPalNumber}`;

    const updatedPals = [...pals, newPalName];
    setPals(updatedPals);
    setCurrentPal(newPalName); // Switch to new chat automatically
  };

  // Function to delete the current pal
  const deleteChat = () => {
    if (pals.length === 1) {
      alert("You must have at least one chat open.");
      return;
    }

    const updatedPals = pals.filter(pal => pal !== currentPal); // Remove current pal
    const newMessages = { ...messages };
    delete newMessages[currentPal];

    setPals(updatedPals);
    setMessages(newMessages);

    // Switch to the first pal
    setCurrentPal(updatedPals[0] || "");
  };

  return (
    <main className="bg-secondary">
      {/* Pals List */}
      <div className="pals">
        <span className="pal-list">Your Pals</span>

        <div className="text-strings">
          {pals.map((pal) => (
            <button
              key={pal}
              onClick={() => setCurrentPal(pal)}
              className={`pal-button ${currentPal === pal ? "active-pal" : ""}`}
            >
              {pal}
            </button>
          ))}
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
}
