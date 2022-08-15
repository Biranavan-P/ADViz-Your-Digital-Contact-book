const express = require("express")
const app = express()
const path = require("path")

let userId = 4
let current_user = null
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(express.static("public"))


let admina = {username: "admina", password: "password", role:"admin"};
let normalo = {username: "normalo", password: "password", role:"normal"};
//TODO Justin fragen wie man weiß welche contacts zurückschicken soll

let contact1_admina = { "ID":0,name: "Unknown", lastname:"User(A)", street:"Wilhelminenhofstraße 75A", zipcode: "10318", city :"Berlin", country:"Germany", phone: 353637437, dateOfBirth: "1990-06-04", isPublic: true,owner : "admina"}
let contact2_admina = {"ID":1,name:"John", lastname:"Doe(A)", street:"Wilhelminenhofstraße 75A", zipcode:"12459",  city :"Berlin",  country:"Germany",phone: 6436377, dateOfBirth:"1990-04-07", isPublic:false ,owner : "admina"}
let contact1_normalo = {"ID":2,name:"Dennis",lastname: "Doe(N)",street: "Straße des 17. Juni 135", zipcode:"10623",  city :"Berlin",  country:"Germany",phone: 353637437,dateOfBirth: "1990-06-04", isPublic:true,owner : "normalo"}
let contact2_normalo = {"ID":3,name:"Piet", lastname:"Doe(N)", street:"Kaiserswerther Str. 16-18",zipcode: "14195 ",  city : "Berlin",  country:"Germany",phone: 88325652, dateOfBirth:"1990-06-04",isPublic:true,owner : "normalo"}


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
function getContactDB(){

    return contacts.filter(X=> X.owner === current_user|| X.isPublic)
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
        current_user = contact.username
        res.send(JSON.stringify(contact))
    }
    else{
        res.status(401).send("unauthorized")
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
    let public = req.body["Public Contact"]
    let owner= req.body["Owner"]
    if (!first_name  || !last_name  || !adress || !zip || !city|| !public || !owner){
        res.status(400).send("Bad Request")
    }
    let contact = {
        "ID":userId,
        "first name ": first_name,
        "last name" : last_name,
        "adress" : adress,
        "zip":zip,
        "city":city,
        "country":country,
        "phone":phone,
        "dob":dob,
        "isPublic":public,
        "owner": owner
    }

    addContactDB(contact)
    res.header("Location",("/contacts/")+userId.toString())
    res.sendStatus(200)
    userId++
    

}

function getContact(req,res){
    let contact_list = getContactDB()
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
    let public = req.body["Public Contact"]
    if (first_name === null || last_name === null || adress ===null || zip===null || city === null || public === null){
        res.sendStatus(200)
    }
    let contact = {
        "ID":userId,
        "first name ": first_name,
        "last name" : last_name,
        "adress" : adress,
        "zip":zip,
        "city":city,
        "country":country,
        "phone":phone,
        "dob":dob,
        "isPublic":public
    }
    if (updateContactDB(contact)){
        res.sendStatus(200)

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