const supertest = require("supertest")
var expect = require('chai').expect
const request = supertest("http://localhost:3000/");
let admina = {username: "admina", password: "password", role:"admin"};
let normalo = {username: "normalo", password: "password", role:"normal"};

let contact_n = {
    ID:4,
    name: "Garfield",
    lastname:"Kitty",
    street:"Badensche Str. 52",
    zipcode: "10825",
    city :"Berlin",
    country:"Germany",
    phone: 5448658,
    dateOfBirth:"1990-06-04",
    isPublic: false,
    owner : "normalo"
}



let normalo_contact = {

    "First Name": "Garfield",
    "Last Name" : "Kitty",
    "Street & Number" : "Badensche Str. 52",
    "ZIP":"10825",
    "City":"Berlin",
    "Country":"Germany",
    "Phone":5448658,
    "Date of birth":"1990-06-04",
    "Public Contact":"false",
    "Owner": "normalo"
}

let contact_a = {
    ID:5,
    name: "adminas",
    lastname:"friend",
    street:"Unter den Linden 6",
    zipcode: "10117",
    city :"Berlin",
    country:"Germany",
    phone: 25252522,
    dateOfBirth:"1990-09-04" ,
    isPublic: false,
    owner : "admina"
}

let admina_contact = {

    "First Name": "adminas",
    "Last Name" : "friend",
    "Street & Number" : "Unter den Linden 6",
    "ZIP":"10117",
    "City":"Berlin",
    "Country":"Germany",
    "Phone":25252522,
    "Date of birth":"1990-09-04",
    "Public Contact":"false",
    "Owner": "admina"
}







let contact1_admina = { ID:0,name: "Unknown", lastname:"User(A)", street:"Wilhelminenhofstraße 75A", zipcode: "10318", city :"Berlin", country:"Germany", phone: 353637437, dateOfBirth: "1990-06-04", isPublic: true,owner : "admina"}
let contact2_admina = {ID:1,name:"John", lastname:"Doe(A)", street:"Wilhelminenhofstraße 75A", zipcode:"12459",  city :"Berlin",  country:"Germany",phone: 6436377, dateOfBirth:"1990-04-07", isPublic:false ,owner : "admina"}
let contact1_normalo = {ID:2,name:"Dennis",lastname: "Doe(N)",street: "Straße des 17. Juni 135", zipcode:"10623",  city :"Berlin",  country:"Germany",phone: 353637437,dateOfBirth: "1990-06-04", isPublic:true,owner : "normalo"}
let contact2_normalo = {ID:3,name:"Piet", lastname:"Doe(N)", street:"Kaiserswerther Str. 16-18",zipcode: "14195 ",  city : "Berlin",  country:"Germany",phone: 88325652, dateOfBirth:"1990-06-04",isPublic:true,owner : "normalo"}






let  admina_contacts= [contact1_admina,contact2_admina,contact1_normalo,contact2_normalo,contact_n,contact_a]
let  normalo_contacts= [contact1_admina,contact1_normalo,contact2_normalo,contact_n]



describe("Users",()=> {
    it("authenticate Admina",async () => {


        const res = await request
            .post("users").send(
                {
                    name: admina.username,
                    password: admina.password
                })
            .expect(200);
        expect(res.body).to.deep.equal(admina);

    })
    it("authenticate normalo",async () => {


        const res = await request
            .post("users").send(
                {
                    name: normalo.username,
                    password: normalo.password
                })
            .expect(200);
        expect(res.body).to.deep.equal(normalo);

    })

    it("authenticate wrong",async () => {


        const res = await request
            .post("users").send(
                {
                    name: "test1",
                    password: "normalo.password"
                })
            .expect(401);
        expect(res.text).to.equal("Unauthorized");

    })


})

describe("add contact (post) ",()=> {




    it("POST /Contacts normalo, correct",async ()=>{

        const res = await request.post("contacts").send(normalo_contact).expect(201)
        expect(res.header.location).to.equal("/contacts/4")



    })

    it("POST /Contacts admina, correct",async ()=>{



        const res2 = await request.post("contacts").send(admina_contact).expect(201)
        expect(res2.header.location).to.equal("/contacts/5")

    })

    it("POST /Contacts uncorrect" ,async ()=>{

        const res = await request.post("contacts").send("contact").expect(400)
        expect(res.text).to.equal("Bad Request");





    })

})


describe("get contact (get) ",()=> {
    it("get /Contacts, normalo",async ()=>{

        const res = await request.get("contacts").send({
            "current_user" :"normalo"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal(normalo_contacts)


    })

    it("get /Contacts, normalo",async ()=>{

        const res = await request.get("contacts").send({
            "current_user" :"admina"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal(admina_contacts)


    })

    it("get /Contacts, unkown_user",async ()=>{

        const res = await request.get("contacts").send({
            "current_user" :"alex"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal([])


    })



})


describe("update contact (put) ",()=> {
    it("update /Contacts, normalo",async ()=>{
        normalo_contact["ID"] = 4
        normalo_contact["Street & Number"] = "Luxemburger Str. 10"
        normalo_contact["ZIP"] = "13353"


        contact_n["street"] = "Luxemburger Str. 10"
        contact_n["zipcode"] = "13353"

        await request.put("contacts/4").send(normalo_contact).expect(204)

        const res = await request.get("contacts").send({
            "current_user" :"normalo"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal(normalo_contacts)



    })

    it("update /Contacts, admina",async ()=>{
        admina_contact["ID"] = 5
        admina_contact["Street & Number"] = "Am Neuen Palais 10"
        admina_contact["ZIP"] = "14469"
        admina_contact["City"] = "Potsdam"

        contact_a["street"] = "Am Neuen Palais 10"
        contact_a["zipcode"] = "14469"
        contact_a["city"] = "Potsdam"

        await request.put("contacts/5").send(admina_contact).expect(204)

        const res = await request.get("contacts").send({
            "current_user" :"admina"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal(admina_contacts)



    })
    it("update /Contacts, empty contact",async ()=>{

        await request.put("contacts/4").send(" ").expect(400)





    })
    it("update /Contacts, unknown contact ID",async ()=>{

        await request.put("contacts/10").send(admina_contact).expect(400)





    })





})


describe("delete contact (delete)",()=> {
    it("delete normalo contact",async () => {


        await request
            .delete("contacts/4")
            .expect(200);


        const res = await request.get("contacts").send({
            "current_user" :"normalo"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal([contact1_admina,contact1_normalo,contact2_normalo])
    })

    it("delete admina contact",async () => {


        await request
            .delete("contacts/5")
            .expect(200);


        const res = await request.get("contacts").send({
            "current_user" :"admina"
        })
        expect(res.statusCode).to.equal(200)



        expect(res.body).to.deep.equal([contact1_admina,contact2_admina,contact1_normalo,contact2_normalo])
    })

    it("delete admina contact",async () => {


        await request
            .delete("contacts/20")
            .expect(400);




})})