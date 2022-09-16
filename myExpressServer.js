const express = require("express")
const app = express()
const path = require("path")
const uri = "mongodb://localhost:27017"

const {MongoClient} = require('mongodb');
const client = new MongoClient(uri);
const dbName = "advizDB";
const contacts = client.db('advizDB').collection('contacts');



async function connectDB() {
    try {
        console.log("connecting to MongoDB");
        await client.connect();
        console.log("connected to Database!");

    } catch (e) {
        console.error(e);
        await client.close();
        process.exit(-1);
    }

}



app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))


async function getUserID(){
    let next_id = await  client.db(dbName).collection("contacts").find().sort({_id:-1}).limit(1).toArray()
    next_id = await next_id[0]._id
    return next_id+1

}


//DB
async function getUserDB(name) {
    const result = await client.db(dbName).collection("users").findOne({username: name});

    if (result) {
        delete result['_id'];
        return result;
    } else {
        return null;
    }

}

function addContactDB(contact){
    client.db(dbName).collection("contacts").insertOne(contact)




}
async function getContactDB(current_user, mode) {
    let owner = await getUserDB(current_user)
    if (owner === null) {
        return []
    } else if (owner.role === "admin" && mode === "all") {
        return await client.db(dbName).collection("contacts").find().toArray();
    } else if (owner.role === "normal" && mode === "all") {
        const filter = {
            '$or': [
                {
                    'owner': owner.username
                }, {
                    'isPublic': true
                }
            ]
        };
        const cursor = await contacts.find(filter);
        return await cursor.toArray();
    } else if (mode === "my") {
        const filter = {
            'owner': owner.username
        };

        const cursor = await contacts.find(filter);
        return await cursor.toArray();

    } else {
        return []
    }

}
async function updateContactDB(contact) {
    let res = await contacts.updateOne({ _id: contact._id },
        { $set:  contact },
        { upsert: false }
    );

    return  (await res.matchedCount === 1 );


}
async function deleteContactDB(user_id) {
    let res = await contacts.deleteOne({"_id": user_id});
    return await res.deletedCount === 1;
}



//Funct
async function authenticate(req, res) {
    let name = req.body["name"]
    let password = req.body["password"]

    let contact = await getUserDB(name)
    if (contact != null && contact.password === password) {
        res.status(200).json(contact)
    } else {
        res.status(401).send("Unauthorized")
    }
}


async function addContact(req, res) {
    let first_name = req.body["First Name"]
    let last_name = req.body["Last Name"]
    let adress = req.body["Street & Number"]
    let zip = req.body["ZIP"]
    let city = req.body["City"]
    let country = req.body["Country"]
    let phone = req.body["Phone"]
    let dob = req.body["Date of birth"]
    let visibility = req.body["Public Contact"]
    let owner = req.body["Owner"]
    let lat = req.body["lat"]
    let lng = req.body["lng"]

    if (!first_name || !last_name || !adress || !zip || !city  || !owner) {
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true' || visibility === true);
    let id = await getUserID()
    let contact = {
        _id: id,
        name: first_name,
        lastname: last_name,
        street: adress,
        zipcode: zip,
        city: city,
        country: country,
        phone: phone,
        dateOfBirth: dob,
        isPublic: isPublic,
        owner: owner,
        lat: lat,
        lng: lng
    }

    await addContactDB(contact)
    res.set("Location", ("/contacts/") + id.toString())
    res.status(201).send()


}

async function getContact(req, res) {
    let contact_list = await getContactDB(req.query.current_user, req.query.mode)

    res.send(contact_list)
}

async function update_contact(req, res) {

    let userId = req.url.toString().replace("/contacts/", "")
    userId = parseInt(userId)
    let first_name = req.body["First Name"]
    let last_name = req.body["Last Name"]
    let adress = req.body["Street & Number"]
    let zip = req.body["ZIP"]
    let city = req.body["City"]
    let country = req.body["Country"]
    let phone = req.body["Phone"]
    let dob = req.body["Date of birth"]
    let visibility = req.body["Public Contact"]
    let owner = req.body["Owner"]
    let lat = req.body["lat"]
    let lng = req.body["lng"]
    if (!first_name || !last_name || !adress || !zip || !city || !owner) {
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true' || visibility === true);

    let contact = {
        _id: userId,
        name: first_name,
        lastname: last_name,
        street: adress,
        zipcode: zip,
        city: city,
        country: country,
        phone: phone,
        dateOfBirth: dob,
        isPublic: isPublic,
        owner: owner,
        lat: lat,
        lng: lng
    }
    if (await updateContactDB(contact)) {
        res.sendStatus(204)

    } else {
        res.sendStatus(400)

    }

}


async function delete_contact(req, res) {
    let userId = req.url.toString().replace("/contacts/", "")
    userId = parseInt(userId)
    if (await deleteContactDB(userId)) {
        res.sendStatus(200)

    } else {
        res.sendStatus(400)

    }
}



//HTTP Requests

async function main (){
    await connectDB()
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname)+"/index.html")
    })


    app.post("/users", authenticate)


    app.post("/contacts", addContact)

    app.get("/contacts", getContact)
    app.put("/contacts/*", update_contact)

    app.delete("/contacts/*", delete_contact)
    app.listen(3000)
    console.log("listening on Port 3000")
}

main()
