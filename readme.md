# ADViz Your Digital Contact-book with GeoCoding and Maps Implementation.



Name: Biranavan Parameswaran

Matrikel-Nr: 577680

Project name: ADViz (Projekt Ordner: biri_justin-WAD2022 )

## Project Description
This project is an implementation of a frontend website and a backend server.

The frontend is designed with HTML and CSS and the logic is injected by plain Javascript.

The backend is designed with NodeJS and ExpressJS using a MongoDB database.
The frontend can be displayed by any regular modern browser. 
I recommend using the latest version of Mozilla Firefox.
The backend can be run on any machine with NodeJS installed, however you need to have a MongoDB database instance running on the same machine. 
I recommend using the latest version of [NodeJS](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/try/download/community).
In addition, you need the following library's: [express](https://expressjs.com/),[mongodb](https://www.npmjs.com/package/mongodb)

Clone this repo by entering this command in to your terminal: 
```bash
git clone https://github.com/Biranavan-P/biri_justin-WAD2022.git
```

After downloading the repo, you need to install the required libraries. 
Please navigate to the folder "biri_justin-WAD2022" and run the following command:
```bash
npm install
```

Please open this project in an IDE of your choice and navigate to the ./index.html file.

If the IDE asks you to install additional UNPKG packages (Font Awesome Script and Google Maps JS API Loader) which are required for the project, please install them.



Please also install [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install)
This is necessary to add the data to the database.
## How to run the project
Disclaimer: If one of the following MongoDB commands does not work, ensure that the command is stored in the environment variable. This project was developed with the MongoDB version 6.0.1!


The first step is to start the MongoDB database service. Open your terminal and enter the following command:
```
mongod
```
This will start the database on the default port 27017.
On older versions of MongoDB, you might need to run the following command:
```
mongo
```

If the service stops with an exit code 100, you need to create a folder called "data\db" in ~/data/db/ on macOS/Linux and C:\data\db on Windows and run the command again.

**Important: Please do not close this terminal window, as the database will be closed.**

### The following steps can be skipped if you have already created the database with collection users!
The next step is to create a database called "advizDB" and a collection called "users" filled with data.
Open a new terminal and enter the following command:
```
mongosh
```
This will open the MongoDB shell.
Now enter the following commands:
```
use advizDB
```

```
db.createCollection("users")
```

```
db.users.insertMany([
   {"username": "admina", "password": "password", "role":"admin"},
{"username": "normalo", "password": "password", "role":"normal"}
])

```
Now you have created a database called "advizDB" with a collection called "users" and inserted two users. Please close this terminal window.

### Creating the collection "contacts"

Before starting the NodeJS server I recommend to add some contacts to the database.
I assume that the database "advizDB " already exists and the collection "users" is already created. If these conditions are not fulfilled please follow the steps above!


**Attention!**

If another collection "contacts" already exists, it will be deleted automatically. 

The script addContactsMongoDB.js in the project folder will create a new collection "contacts" and add the contacts to it.
It is very important that you start the terminal in the project folder.
Please enter the following command in the terminal:

```
mongosh localhost:27017/advizDB .\addContactsMongoDB.js
```
On older versions you have to enter the following command:
```
mongo localhost:27017/advizDB .\addContactsMongoDB.js
```

Added contacts to DB! will be displayed if the script was successful.



Now you can start the server from the project folder by entering the following command in the terminal:
```
node myExpressServer.js
```
The server will start and listen on port 3000. The server will display the following message:
```
connecting to MongoDB
connected to Database!
listening on port 3000
```

if you get the following error message:
```
MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```
Please make sure that you have a MongoDB instance running on the same machine and listening on port 27017. You can find an example above.

Now you can open the website in your browser by entering the following URL:
```
http://localhost:3000/
```
The website will be displayed, and you can start using it.


## How to use the website
The website is divided into two parts. The first part is the login page. The second part is the main page.
The login page is displayed when you open the website. You can login with the following credentials:
```
username: admina
password: password
```
or
```
username: normalo
password: password
```
The login page will display an error message if you enter wrong credentials.

The buttons Create Account and Reset Password are not implemented yet and therefore dont have any functionality yet.

After you have logged in, you will be redirected to the main page.

In the main page you can see your contacts or all (public) contacts  if you are logged in as (normalo) admin. In addition, you can push the buttons Show All Contacts and Show All My Contacts

You can also add new contacts, edit existing contacts and delete contacts.
All contacts are displayed on the left site of the page. In addition, the address of the contact is displayed on the map on the right side of the page.


The header buttons: Map, Contacts, About are not implemented yet and therefore dont have any functionality yet.
**Note**: The map will not be displayed if you are not connected to the internet. In addition, it will show you "For development purposes only" due to the fact that an API key from Google Maps is used. This API is connected to restrictions and therefore this hint is displayed.

## Testing
You can run a test on the server. You can find the test in the test/myExpressServerTest.js . Please start the server as described above and open a new terminal window.
Please enter the following command in the terminal:
```
npx mocha
```
or if the above command does not work:
```
npm test
```

Attention: The test will overwrite the collection contacts. Please make sure that you have a backup of the collection contacts before running the test.


## Dependencies / APIs

[TrueWay GeoCoding](https://rapidapi.com/trueway/api/trueway-geocoding/) \
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) \
[Maps JS API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader)
[NodeJS](https://nodejs.org/en/) \
[MongoDB](https://www.mongodb.com/try/download/community)\
[express (npm)](https://expressjs.com/)\
[mongodb(npm)](https://www.npmjs.com/package/mongodb)
