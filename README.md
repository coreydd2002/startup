# startup
startup project for byu cs 260


Elevator pitch
As human beings, we all need someone to talk to. We need to express how we are feeling. But sometimes we cant share our feelings 
with those who are involved in our lives, becuase it could be relavant to them and could cause further issues. I will create a website 
that will allow you to express your feelings to people who arent directly involved in your life in any way. in fact they will be 
complete strangers! This website will anonomously connect you to another user with a text string where you can hold a private 
conversation without any consequences! this can help others get weight off of their chest as they can talk through how they have been 
feeling without needing to reveal their true identity. 

design

<img width="592" alt="Screenshot 2024-09-14 201907" src="https://github.com/user-attachments/assets/ca690006-0dc9-4818-82a7-58ad74a61afb">

Key features:
Secure login over HTTPS
ability to pair up with a random user
selectible list of all current text srings,
can send messages privately between users
Total text strings 
can delete or report other users 
every text message saved
randomly generates a name for other anonomys users

Technologies
I am going to use the required technologies in the following ways.
HTML - Uses correct HTML structure for application. Two HTML pages. One for login and one for texting others. 
CSS - Application styling that looks good on different screen sizes, uses good whitespace, color choice and contrast.
React - Provides login, choice display, sending and recieving texts, display other users texts, and use of React for routing and components.
Service - Backend service with endpoints for:
login
retrieving messages
sending messages
DB/Login - Store users, and messages in database. Register and login users. Credentials securely stored in database.
WebSocket - As each user text, their texts are broadcast to only the disired other user.

