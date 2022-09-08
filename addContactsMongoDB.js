const uri = "mongodb://localhost:27017"

const {MongoClient} = require('mongodb');
const client = new MongoClient(uri);

const dbName = "advizDB";
async function connectDB() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
    } catch (e) {
        console.error(e);
        await client.close();
    }

}
async function doesCollectionExistInDb() {
    const collections = await client.db(dbName).collections();
    return collections.some(
        (collection) => collection.collectionName === "contacts"
    );
}



let contact1_admina = { _id:0,name: "Unknown", lastname:"User(A)", street:"Wilhelminenhofstraße 75A", zipcode: "10318",
    city :"Berlin", country:"Germany", phone: 353637437, dateOfBirth: "1990-06-04", isPublic: true,owner : "admina",
    lat:52.49326,lng:13.52614
}
let contact2_admina = {_id:1,name:"John", lastname:"Doe(A)", street:"Wilhelminenhofstraße 75A", zipcode:"12459",
    city :"Berlin",  country:"Germany",phone: 6436377, dateOfBirth:"1990-04-07", isPublic:false ,owner : "admina",
    lat:52.4581,lng:13.52709
}
let contact1_normalo = {_id:2,name:"Dennis",lastname: "Doe(N)",street: "Straße des 17. Juni 135", zipcode:"10623",
    city :"Berlin",  country:"Germany",phone: 353637437,dateOfBirth: "1990-06-04", isPublic:true,owner : "normalo",
    lat:52.51274,lng:13.3269
}
let contact2_normalo = {_id:3,name:"Piet", lastname:"Doe(N)", street:"Takustraße 9",zipcode: "14195",
    city : "Berlin",  country:"Germany",phone: 88325652, dateOfBirth:"1990-06-04",isPublic:false,owner : "normalo",
    lat:52.45585,lng:13.29738
}
let  contacts= [contact1_admina,contact2_admina,contact1_normalo,contact2_normalo]

async function main (){
    try {
        await connectDB()

         if (await doesCollectionExistInDb()){
             client.db(dbName).collection("contacts").drop();
         }

        await client.db(dbName).collection("contacts").insertMany(contacts );
        console.log("Added contacts to DB!")


    } catch (e) {
        console.log(e);
    }
finally {
        await client.close();


    }

}
main()





