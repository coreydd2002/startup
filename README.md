# AWS Deliveralbe
- [x] Server deployed and accessible with custom domain name - penpal.click

# HTML deliverable
- [x] HTML pages - I created 3 pages: login, main and about
- [x] Proper HTML element usage - I used all the tags to outline all sections of my content
- [x] Links - Every page has links to the other 2 pages in the header
- [x] Text - I icluded a description in my about page of what the website is
- [x] 3rd party API placeholder - On the main page, there is a placeholder for a text string
- [x] Images - I replaced the image on the about page with my own
- [x] Login placeholder - In the login boxes, there is text that displays before you type
- [x] DB data placehoder - The code from simon's data placeholder is still there but hidden
- [x] WebSocket placeholder - There is a text string where you can actually type.

# CSS delverable
- [x] Header, footer, and main content body - The header and footer are consistent on all pages. the main content is different across pages. the main page body includes three rows of content
- [x] Navigation elements - The navigation across pages is included in the header and is spaced out evenly and is consistent across all pages
- [x] Responsive to window resizing - I used the flex feature to allow the content on the page to respond to the windows resizing
- [x] Application elements - On the main page, I provided a section with a list of your pals to talk to, the text string section, and an options section. I used fflex to place them in rows sibe by side and to take up the entire window between the header and footer
- [x] Application text content - I refitted the description in the about page and justified the paragragh. 
- [x] Application images - I resixed the image to take up more space on the about page

# React part 1 Deliverable

- [x] Port Simon CSS to use React as defined in the Simon React Part 1 instruction.
- [x] Convert your HTML/CSS startup frontend to use React.
- [x] Make sure your name is displayed in the application and that there is a link to your GitHub repository.
- [x] Periodically commit and push your code to GitHub.
- [x] Periodically update your startup repository's notes.md file to reflect what you have learned and want to remember.
- [x] Push your final version of your project to GitHub.
- [x] Deploy your startup application to your production environment (your server).
- [x] Make sure your application is available from your production environment.
- [x] Upload the URL to your startup application to the Canvas assignment.

# React part 2 Deliverable

- [x] Review and deploy Simon React
  - Clone the Simon React repository to your development environment.
  - Execute your frontend code in your development environment by running npm run dev from the console in the root of the project. This will automatically open your browser to
    https://localhost:5173. Use the browser's dev tools to step through the frontend JavaScript using the Source tab.
  - Deploy to your production environment using the deployment script so that it is available with your domain's simon subdomain.
- [x] Implement the JavaScript code using the React framework to make your startup completely functional.
  - Use React useState and component properties for the reactive parts of each component.
  - Add React useEffect for component lifecycle events.
  - Add JavaScript to control what gets rendered based upon the current state of the component.
  - Mock out a working solution for any functionality that will be implemented in a later deliverable. For example, use setInterval to simulate WebSocket message, or use LocalStorage for persisting user data.
- [x] Make sure your name is displayed in the application and that there is a link to your GitHub repository.
- [x] Periodically commit and push your code to GitHub.
- [x] Periodically update your startup repository's notes.md file to reflect what you have learned and want to remember.
- [x] Push your final version of your project to GitHub.
- [x] Deploy your startup application to your production environment (your server).
- [x] Make sure your application is available from your production environment.
- [x] Upload the URL to your startup application to the Canvas assignment.

# Startup Service Deliverable

- [x] Review and deploy Simon Service

   1. Clone the Simon Service repository to your development environment.
      ```
      git clone https://github.com/webprogramming260/simon-service.git
      ```
   1. Run `npm install` in the root of the project.
   1. Open the project in VS Code and examine the application's use of Node.js, Express, and JavaScript to create service endpoints.
   1. Execute in your development environment by debugging the application using VS Code's Node.js debugger (press F5 while viewing `index.js`). Set breakpoints in VS Code and step through the backend JavaScript.
   1. Start your frontend code using Vite by running `npm run dev`.
   1. Open your browser to http://localhost:5173 and use the browser's dev tools to step through the frontend JavaScript using the Source tab.
   1. Deploy to your production environment using the deployment script so that it is available with your domain's `simon` subdomain.

- [x] Convert your startup application into a web service using Node.js and Express.

   1. Create a service/index.js file for your backend
   1. Add this code to service/index.js to allow your code to select a port to run on based on the command line parameters.
      ```js
      const port = process.argv.length > 2 ? process.argv[2] : 4000;
      ```
   1. Add this code to service/index.js to cause Express static middleware to serve files from the public directory once your code has been deployed to your AWS server.
      ```js
      app.use(express.static('public'));
      ```
   1. Add a vite.config.js file to your main startup directory (right above the service and src directories) with the following content (or copy it over from Simon). This will forward fetch requests that go to a path like "fetch('/api/scores')" to connect to your backend server running on port 4000.

      ```js
      import { defineConfig } from 'vite';

      export default defineConfig({
        server: {
          proxy: {
            '/api': 'http://localhost:4000',
          },
        },
      });
      ```

- [x] Create new endpoints for your backend (service/index.js) that are similar to those created by Simon.
- [x] Call your endpoints from your frontend code using fetch.
- [x] Call third party endpoints from your frontend code using fetch. This can be as simple as displaying a quote like Simon does.
- [x] Debug your application by running your backend using VS Code's Node debugger on the service/index.js file and the browser's inspect dev tools to verify it is working correctly. You will have to run "npm run dev" to get your front end running.
- [x] Periodically commit and push your code to GitHub.
- [x] Periodically update your startup repository's notes.md file to reflect what you have learned and want to remember.
- [x] Push your final version of your project to GitHub.
- [x] Copy "deployService.sh" over from your Simon Service source code. You won't be able to use the deploy scripts from previous projects.
- [x] Deploy your startup application to your production environment (your server) using "deployService.sh".
- [x] Make sure your application is available from your production environment.
- [x] Upload the URL to your startup application to the Canvas assignment.
