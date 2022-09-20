# ADViz Your Digital Contact-book with GeoCoding and Maps Implementation.



Name: Biranavan Parameswaran

Matrikel-Nr: 0577680

Project name: ADViz (Projekt Ordner: biri_justin-WAD2022 )

## Project Description
This project is an implementation of a frontend website and a backend server.

The frontend is designed with HTML and CSS and the logic is injected by plain Javascript.

The backend is designed with NodeJS and ExpressJS using a MongoDB database.
The frontend can be displayed by any regular modern browser. 
I recommend using the latest version of Mozilla Firefox.
The backend can be run on any machine with NodeJS installed, however you need to have a MongoDB database instance running on the same machine.
In addition, you need the following library's: [express](https://expressjs.com/),[mongodb](https://www.npmjs.com/package/mongodb)

You can install both libraries using the following command:
```
npm install express mongodb
```

Please also install [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/#std-label-mdb-shell-install)
This is necessary to add the data to the database.
## How to run the project
The first step is to start the MongoDB database. Open your terminal and enter the following command:
```
mongod
```
This will start the database on the default port 27017.
On older verions of MongoDB, you might need to run the following command:
```
mongo
```


Before starting the server I recommend to add some contacts to the database.
I assume that the database "advizDB " already exists and the collection "users" is already created.

**Attention!**

If another collection "contacts" already exists, it will be deleted automatically. 

The script will create a new collection "contacts" and add the contacts to it.
It is ver important that you start the terminal in the project folder.
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



## Dependencies / APIs

[TrueWay GeoCoding](https://rapidapi.com/trueway/api/trueway-geocoding/) \
[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview) \
[Maps JS API Loader](https://www.npmjs.com/package/@googlemaps/js-api-loader) 
