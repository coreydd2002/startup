# startup - PenPal

## Elevator pitch:

As human beings, we all need someone to talk to. We need to express how we are feeling. But sometimes we cant share our feelings 
with those who are involved in our lives, becuase it could be relavant to them and could cause further issues. I will create a website 
that will allow you to express your feelings to people who arent directly involved in your life in any way. in fact they will be 
complete strangers! This website will anonomously connect you to another user with a text string where you can hold a private 
conversation without any consequences! this can help others get weight off of their chest as they can talk through how they have been 
feeling without needing to reveal their true identity. 

### design

<img width="592" alt="Screenshot 2024-09-14 201907" src="https://github.com/user-attachments/assets/ca690006-0dc9-4818-82a7-58ad74a61afb">

### Key features: 
-Secure login over HTTPS 
-ability to pair up with a random user 
-selectible list of all current text srings, 
-can send messages privately between users 
-Total text strings  
-can delete or report other users  
-every text message saved 
-randomly generates a name for other anonomys users 

### Technologies: 
I am going to use the required technologies in the following ways. 
HTML - Uses correct HTML structure to display a login page and a text string page. This will require two HTML pages.
CSS - Application styling that can be nicely refitted on different screen sizes, uses good whitespace, color choice and contrast. 
React - Provides login, choice display, sending and recieving texts, display other users texts, and use of React for routing and components. 
Service - Backend service with endpoints for: 
 -login 
 -retrieving messages 
 -sending messages 
DB/Login - Store users, and messages in database. Register and login users. Credentials securely stored in database. 
WebSocket - As each user text, their texts are broadcast to only the disired other user. 

## Developing PenPal

### step 1: AWS
I followed the given instructions to set up my own domain. I was able to claim the domain PenPal.click. I will be using this 
domain to develop my website

### step 2: HTML
After learning about HTML pages, I created some basic html pages to give my website a bit of scafolding to build off of. 
I have a login page, a pals page for chatting, and an about page.

### step 3: CSS
After learning about the cascading style sheets, I created some CSS pages to match with each html page. I later created an index page 
that has general rules that applied to all the html. 

### step 4: React
After learning javascript, I created jsx files for each of my web pages. These pages included the html. doing this gave my pages some 
functionality. I was able to travel across pages without rerouting through the browser. Instead, all of the pages are already loaded 
but now the buttons on the page allow the user to seemlessly navegate accross pages without reloading. I later added functionality 
to my pals page to allow the user to send messages, start new chats and delete chats. I also created jsx files that allow for propper 
login procedure. 

### step 5: Service
After learning about web services, I was able to reorganize my files to have a public folder for all of the front end code and a
service folder that contains all of the backend code. This restricts the access of sensitive information such as backend code and 
database access.It also made it that both backend and frontend code can work together on the same port. I am now also set up and 
ready to connect my website to a database. 







