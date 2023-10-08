# Function
This project allows you to create a Google Calendar around the UC Davis courses you choose in the interface.



# HOW TO USE
1. Create a react app in terminal using the command "npx create-react-app schedbuild4" and replace all files except for "node-modules" & "public" in the created folder with the files in this repository.
2. Create Google Api account and get credentials (detailed below!)
3. Create new Google calendar that you wish to create your class schedule in and get credentials (detailed below!)
4. "cd" into your new folder ("schedbuild4")
5. Install all dependecies and vite by pasting the following commands into the terminal:
     npm install body-parser
     npm install browserify-shim
     npm install cors
     npm install dotenv
     npm install express
     npm install googleapis
     npm install puppeteer
     npm install react
     npm install react-dom
     npm install react-icons
     npm install reactjs-popup
     npm install save
     npm install vite
7. Open 2 terminals
8. Paste "npm run start" in one of the terminals
9. Paste "npm run dev" in the other terminal
10. Copy the localhost link in the "npm run dev" terminal
11. Paste the link into your chrome browser and enjoy!!


-------------**ALL STEPS TO SETUP GOOGLE API BELOW ARE TAKEN FROM https://www.youtube.com/watch?v=dFaV95gS_0M**

-------------**A new file is created in the sections below; temp.txt in this repository simulates what the end product should look like!**
# Steps to create google api access (step 2) ~
1. Go to https://console.cloud.google.com/apis/library and login
2. Click "select project" tab and start a new project
3. Search "Google Calendar" in center search bar and select the result
4. Enable "Google Calendar" api and click "manage"
5. Go to "OAuth consent screen" tab and edit:
        Set user type to external
        Select /auth/cloud-services scope
        Enter email of who would be owning the google calendar you want to manipulate into test users
7. Go to "Credentials" tab and create credentials
8. **Return to "Credentials" tab, copy the "client id", and paste it in the indicated section of the manifest.json file!**
9. Click navigation menu, hover "IAM & Admin", and click "Service Accounts"
10. Create new service account:
        Select "Owner" (found under "basic") as role
11. Click 3 dots next to the new service account info and click "manage keys"
12. Create new key and set it to JSON
13. Move the new JSON file to project folder ("schedbuild4")
14. **Rename file to ".env"**
15. **Copy down the client-email between the quotations for the section below!**
16. Create a variable called "CREDENTIALS" and set it equal to the entire object in the file
17. Remove spaces between elements in the Credentials object to make it all one line
18. Create a variable under the CREDENTIALS variable called "CALENDAR_ID" and set it equal to the value highlighted at the end of the section below!

# Steps to set up calendar to be manipulated (step 3) ~
1. Log into the Google email you with to create your class schedule in
2. Go to Google Calendar
3. Create a new calendar under the "other calendars" tab
4. Go to the new calendar's tab
5. Scroll down to "Share with specific people or groups" and add the email copied in step 15 of the section above
6. **Scroll down to "Integrate calendar" and copy calendar id**
7. Simply paste calendar id where indicated in step 18 of the section above!
