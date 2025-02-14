import React from 'react';
import './play.css';
export function Play() {
  return (
    <main class="bg-secondary">
      <div class="pals">
        <span class="pal-list">Your Pals</span>
        <hr></hr>

        <ul class="text-strings">
          <li class="pal-alias"><a href="profile.html?user=BlueTiger">Blue Tiger</a></li>
          <hr></hr>
          <li class="pal-alias"><a href="profile.html?user=RedEagle">Red Eagle</a></li>
          <hr></hr>
          <li class="pal-alias"><a href="profile.html?user=NavyOwl">Navy Owl</a></li>
          <hr></hr>
        </ul>
      </div>
      <div class="chat-container">

        <div class="message-display" id="chat">
          <span class="current pal">Blue Tiger</span>
          <div class="message user1">Hey, hows it going?</div>
          <div class="message user2">not too shabby, How about you?</div>
        </div>

        <div class="input-area">
          <input type="text" id="messageInput" placeholder="Type your message..." />
          <button id="sendButton">Send</button>
        </div>
      </div>


      <div class="options-container">
        <div class="input-area">
          <button id="newChat">+ New Chat</button>
        </div>
        <div class="input-area">
          <button id="delete">- Delete Chat</button>
        </div>
        <div class="input-area">
          <button id="Report">! Report</button>
        </div>
      </div>
  </main>
  );
}
