const express = require("express")
const app = express()
const path = require("path")

let userId = 4
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))


let admina = {username: "admina", password: "password", role:"admin"};
let normalo = {username: "normalo", password: "password", role:"normal"};

let contact1_admina = { ID:0,name: "Unknown", lastname:"User(A)", street:"Wilhelminenhofstraße 75A", zipcode: "10318", city :"Berlin", country:"Germany", phone: 353637437, dateOfBirth: "1990-06-04", isPublic: true,owner : "admina"}
let contact2_admina = {ID:1,name:"John", lastname:"Doe(A)", street:"Wilhelminenhofstraße 75A", zipcode:"12459",  city :"Berlin",  country:"Germany",phone: 6436377, dateOfBirth:"1990-04-07", isPublic:false ,owner : "admina"}
let contact1_normalo = {ID:2,name:"Dennis",lastname: "Doe(N)",street: "Straße des 17. Juni 135", zipcode:"10623",  city :"Berlin",  country:"Germany",phone: 353637437,dateOfBirth: "1990-06-04", isPublic:true,owner : "normalo"}
let contact2_normalo = {ID:3,name:"Piet", lastname:"Doe(N)", street:"Kaiserswerther Str. 16-18",zipcode: "14195 ",  city : "Berlin",  country:"Germany",phone: 88325652, dateOfBirth:"1990-06-04",isPublic:true,owner : "normalo"}


let  users = [admina,normalo]
let  contacts= [contact1_admina,contact2_admina,contact1_normalo,contact2_normalo]

//DB
function getUserDB(name){
    let obj = users.find(o => o.username === name);

    if (obj !== null) {
        return obj
    }
    else{
        return null
    }

}

function addContactDB(contact){
    contacts.push(contact)


}
function getContactDB(current_user){
    let owner =getUserDB(current_user)
    if (owner === undefined){
        return []
    }
    else if ( owner.role === "admin"){
        return contacts
    }
    else {
        return contacts.filter(X => X.owner === current_user || X.isPublic )
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
function authenticate (req,res){
    let name = req.body["name"]
    let password = req.body["password"]

    let contact = getUserDB(name)
    if(contact != null && contact.password === password){
        res.status(200).json(contact)
    }
    else{
        res.status(401).send("Unauthorized")
    }
}


function addContact(req,res){
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
    if (!first_name  || !last_name  || !adress || !zip || !city|| !visibility || !owner){
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true');
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
        owner : owner
    }

    addContactDB(contact)
    res.set("Location",("/contacts/")+userId.toString())
    res.status(201).send()
    userId++
    

}

function getContact(req,res){
    let contact_list = getContactDB(req.body.current_user)
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
    if (!first_name  || !last_name  || !adress || !zip || !city|| !visibility || !owner){
        res.status(400).send("Bad Request")
        return
    }
    let isPublic = (visibility === 'true');

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
        owner : owner
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


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname)+"/index.html")
})


app.post("/users",authenticate)


app.post("/contacts",addContact)

app.get("/contacts",getContact)
app.put("/contacts/*",update_contact)

app.delete("/contacts/*",delete_contact)
app.listen(3000)
console.log("listening")