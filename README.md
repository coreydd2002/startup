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

HTML deliverable
For this deliverable I built out the structure of my application using HTML.

 HTML pages - Two HTML page that represent the ability to login and to send/recieve texts.
 Links - The login page automatically links to the users page.
 Text - every message will have text as well as the different usernames
 DB/Login - text box and submit button for login and generating a new text string. 
 WebSocket - The count of current text strings results represent the number of users that a user is texting.

 CSS deliverable
For this deliverable I properly styled the application into its final appearance.

 Header, footer, and main content body
 Navigation elements - I dropped the underlines and changed the color for anchor elements.
 Responsive to window resizing - My app looks great on all window sizes and devices
 Application elements - Used good contrast and whitespace
 Application text content - Consistent fonts and clear contrast from surrounding bubbles
 
React deliverable
For this deliverable I used JavaScript and React so that the application completely works for a single user. I also added placeholders for future technology.

 Bundled and transpiled - done!
 Components - Login, text messages, WebSocket.
 login - When you press enter or the login button it takes you to the text page.
 database - Displayed the text string counts. Currently this is stored and retrieved from local storage, but it will be replaced with the database data later.
 WebSocket - I used the randomizer function to randomly select other users to text. This will be replaced with WebSocket messages later.
 application logic - The highlight and ranking number change based up the user's selections.
 Router - Routing between login and texting components.
 Hooks - Vue uses class properties instead of UseState to track changes in texting data.
 
Service deliverable
For this deliverable I added backend endpoints that receives votes and returns the voting totals.

 Node.js/Express HTTP service - done!
 Static middleware for frontend - done!
 Backend service endpoints - Placeholders for login that stores the current user on the server. Endpoints for texting.
 Frontend calls service endpoints - I did this using the fetch function.
 
DB/Login deliverable
For this deliverable I associate the votes with the logged in user. I stored the votes in the database.

 MongoDB Atlas database created - done!
 Stores data in MongoDB - done!
 User registration - Creates a new account in the database.
 existing user - Stores the votes under the same user if the user already exists.
 Use MongoDB to store credentials - Stores both user and their votes.
 Restricts functionality - You cannot vote until you have logged in. This is restricted on the frontend only. 😔
WebSocket deliverable
➡️ The following is an example of the required information for the Startup WebSocket deliverable

For this deliverable I used webSocket to update the votes on the frontend in realtime.

 Backend listens for WebSocket connection - done!
 Frontend makes WebSocket connection - done!
 Data sent over WebSocket connection - done!
 WebSocket data displayed - All user votes display in realtime. I'm really proud that this is working. Way cool!
