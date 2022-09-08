const express = require("express")
const app = express()
const path = require("path")
const uri = "mongodb://localhost:27017"

const {MongoClient} = require('mongodb');
const client = new MongoClient(uri);
const dbName = "advizDB";




async function connectDB() {
    try {
        console.log("connecting to MongoDB");
        await client.connect();
        console.log("connected to Database!");

    } catch (e) {
        console.error(e);
        await client.close();
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

let contact1_admina = { ID:0,name: "Unknown", lastname:"User(A)", street:"Wilhelminenhofstraße 75A", zipcode: "10318",
    city :"Berlin", country:"Germany", phone: 353637437, dateOfBirth: "1990-06-04", isPublic: true,owner : "admina",
    lat:52.49326,lng:13.52614
}
let contact2_admina = {ID:1,name:"John", lastname:"Doe(A)", street:"Wilhelminenhofstraße 75A", zipcode:"12459",
    city :"Berlin",  country:"Germany",phone: 6436377, dateOfBirth:"1990-04-07", isPublic:false ,owner : "admina",
    lat:52.4581,lng:13.52709
}
let contact1_normalo = {ID:2,name:"Dennis",lastname: "Doe(N)",street: "Straße des 17. Juni 135", zipcode:"10623",
    city :"Berlin",  country:"Germany",phone: 353637437,dateOfBirth: "1990-06-04", isPublic:true,owner : "normalo",
    lat:52.51274,lng:13.3269
}
let contact2_normalo = {ID:3,name:"Piet", lastname:"Doe(N)", street:"Takustraße 9",zipcode: "14195",
    city : "Berlin",  country:"Germany",phone: 88325652, dateOfBirth:"1990-06-04",isPublic:false,owner : "normalo",
    lat:52.45585,lng:13.29738
}
let  contacts= [contact1_admina,contact2_admina,contact1_normalo,contact2_normalo]

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
    contacts.push(contact)


}
async function getContactDB(current_user, mode) {
    let owner = await getUserDB(current_user)
    if (owner === null) {
        return []
    } else if (owner.role === "admin" && mode === "all") {
        return contacts
    } else if (owner.role === "normal" && mode === "all") {
        return contacts.filter(X => X.owner === current_user || X.isPublic)
    } else if (mode === "my") {
        return contacts.filter(X => X.owner === current_user)

    } else {
        return []
    }

}
function updateContactDB(contact){
    let objIndex = contacts.findIndex((obj => obj.ID === contact.ID))
    if(objIndex !== -1){
        contacts[objIndex] = contact
        return true
    }
    else {
        return false
    }


}
function deleteContactDB(user_id){
    let objIndex = contacts.findIndex((obj => obj.ID === user_id))
    if(objIndex !== -1){
        contacts.splice(objIndex,1)
        return true
    }
    else {
        return false
    }

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

    if (!first_name || !last_name || !adress || !zip || !city || !visibility || !owner) {
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true' || visibility === true);
    let id = await getUserID()
    let contact = {
        ID: id,
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

    addContactDB(contact)
    res.set("Location", ("/contacts/") + id.toString())
    res.status(201).send()


}

async function getContact(req, res) {
    let contact_list = await getContactDB(req.query.current_user, req.query.mode)

    res.send(contact_list)
}

function update_contact(req,res){

    let userId = req.url.toString().replace("/contacts/","")
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
    let owner= req.body["Owner"]
    let lat =   req.body["lat"]
    let lng =   req.body["lng"]
    if (!first_name  || !last_name  || !adress || !zip || !city|| !owner){
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true' || visibility === true);

    let contact = {
        ID:userId,
        name: first_name,
        lastname:last_name,
        street:adress,
        zipcode: zip,
        city :city,
        country:country,
        phone: phone,
        dateOfBirth:dob ,
        isPublic: isPublic,
        owner : owner,
        lat: lat,
        lng: lng
    }
    if (updateContactDB(contact)){
        res.sendStatus(204)

    }
    else{
        res.sendStatus(400)

    }

}


function delete_contact(req,res) {
    let userId = req.url.toString().replace("/contacts/","")
    userId = parseInt(userId)
    if(deleteContactDB(userId)){
        res.sendStatus(200)

    }
    else{
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
    console.log("listening to Port 3000")
}

main()
