import {User} from "/data/user.js";

let map;
let marker;
let marker_dict = {

}
let currentUser;
let last_updated_id = -1;
let owner = null;


// Inits the map screen
let initMap = async () => {
    const loader = await new google.maps.plugins.loader.Loader({
        apiKey: "AIzaSyBF0SvLTZkO3pThLmyHnkOrWLCBsWG3ikE",
        version: "weekly",
        libraries: ["drawing"]
    });


    loader.load().then(async () => {
        map = await new google.maps.Map(document.getElementById("mapFrame"), {
            center: {lat: 52.520008, lng: 13.404954},
            zoom: 15,
        });
    });
}


/**
 * Adds a new marker to the map
 * @param id of contact
 * @param name of contact
 * @param lat latitude
 * @param lng longitude
 */


let addMarker = async (id,name, lat, lng) => {
    if (!(marker_dict.hasOwnProperty(id))) {
        marker = await new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: map,
            label: name
        });
    }


    marker_dict[id] = marker;


}
/**
 * removes a  marker from the map
 * @param id of contact

 */
let removeMark = (id)=>{
    if (marker_dict[id] !== undefined){
        marker_dict[id].setMap(null);
        delete marker_dict[id];



    }
}

//HTML changing functions
window.onload = function() {
    // After load up -> Only Login screen is visible

    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";
    last_updated_id = -1;
    owner = null;

}



/**
 * Loads contacts based on the current user and the pressed button
 * @param mode my -> shows the users contacts after login and after pressing "show my contacts"
 *             all -> shows all contacts for admina, shows all public contacts for normalo
 */
let loadContacts = async (mode) => {
    document.getElementById("cList").innerHTML = "";

    switch (mode) {
        case "my":
            let contacts = await getContact("my");
            currentUser.setContacts(contacts);
            let all_users = Object.keys(marker_dict);
            if ( all_users.length !== 0){
                for (let i = 0; i < all_users.length; i++) {
                    let id  = all_users[i]
                    removeMark(id)

                }

            }
            for (let i = 0; i <contacts.length ; i++) {
               let element = contacts[i];
                await updateList(element);
                await addMarker(element._id,(element.name +" "+element.lastname),element.lat,element.lng);

            }

            break;
        case "all":
            let contacts2 = await getContact("all");
            let all_users2 = Object.keys(marker_dict);
            if ( all_users2.length !== 0){
                for (let i = 0; i < all_users2.length; i++) {
                    let id  = all_users2[i]
                    removeMark(id)

                }

            }
            contacts2.forEach(element => {

                updateList(element);
                addMarker(element._id,(element.name +" "+element.lastname),element.lat,element.lng);
            });

            break;
    }
    changeTitle("Adviz | Home")
}




/**
 * Updates the HTML List based on the saved contacts data
 * @param contactEntry new contact
 */
let updateList = async (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.classList.add('contactsListItem');
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry.name + " " + contactEntry.lastname + '</a>'
    await document.getElementById("cList").appendChild(newEntry);


    // Adds onClickEvents for each item in the List
    let listItems = document.querySelectorAll("#cList li");
    listItems.forEach(function (item) {
        item.onclick = async function () {
            update_field_read_only(false);

            let savedUser = currentUser.getContacts().find(o => o.name + " " + o.lastname === this.innerText);
            if (!savedUser) {

                let all_users = await getContact("all");
                savedUser = all_users.find(o => o.name + " " + o.lastname === this.innerText);
                owner = savedUser.owner;

                if (currentUser.getRole() !== "admin") {
                    update_field_read_only(true)
                }


            }
            showUpdateContact(savedUser);
        }
    });
}




let showUpdateContact = (ContactEntry) => {

    changeTitle("Adviz | Update Contact")

    document.getElementById("map_container").style.display = "none";
    document.getElementById("updateContactForm").style.display = "grid";
    // Showing data
    document.getElementById("firstNameU").value = ContactEntry.name;
    document.getElementById("lastNameU").value = ContactEntry.lastname;
    document.getElementById("streetAndNumberU").value = ContactEntry.street;
    document.getElementById("zipcodeU").value = ContactEntry.zipcode;
    document.getElementById("cityU").value = ContactEntry.city;
    document.getElementById("countryU").value = ContactEntry.country;
    document.getElementById("phoneU").value = ContactEntry.phone;
    document.getElementById("dobU").value = ContactEntry.dateOfBirth;
    let box = document.getElementById("privateU")
    if(ContactEntry.isPublic) {
        setCheckboxValue(box, ContactEntry.isPublic);
    }
    last_updated_id = ContactEntry._id;
}


// Forms
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");

// Buttons

document.getElementById("loginBtn").onclick = async function () {
    let errorMessage = document.getElementById("loginErrorMessage");
    let error = "";
    let userValue = username.value;
    let passwordValue = password.value;
    if (!userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Please enter your login details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
        return;
    } else if (userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Password Field can't be empty!"
        errorMessage.innerText = error;
        password.style.borderColor = "red";
        return;

    } else if (!userValue && passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Username Field can't be empty!"
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        return;

    }



    let url = "http://localhost:3000/users"
    let contact = {
        "name" : userValue,
        "password":passwordValue
    }

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    let response = await fetch(url, {   // fetch returns a promise
        method: 'POST',

        headers: headers,
        body: JSON.stringify(contact)  // body data type must match "Content-Type" header
    });
    let success = await response.ok;


    if (success) {
        loginForm.style.display = "none";
        let data = await response.json();

        currentUser = new User(data.username, data.password, data.role);

        await initMap();
        last_updated_id = -1;
        owner = null;
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.getName() + ". Role: " + currentUser.getRole();

        await changeTitle("Adviz | Home");
        await loadContacts("my");
        document.getElementById("map_container").style.display = "grid";


    }
    else if (!success) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Wrong Login Details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";

    }

}

// Add Contact Event -> Reads user input and calls addContact func
document.getElementById("addButton").onclick = async function (event) {
    event.preventDefault();

    let firstnameForm = document.getElementById("firstName");
    let lastnameForm = document.getElementById("lastName");
    let streetForm = document.getElementById("streetAndNumber");
    let zipcodeForm = document.getElementById("zipcode");
    let cityForm = document.getElementById("city");
    let countryForm = document.getElementById("country");
    let phoneForm = document.getElementById("phone");
    let dobForm = document.getElementById("dob");
    let privateForm = document.querySelector('.privateCheckbox:checked')

    let errorLabel = document.getElementById("addContactErrorLabel");

    const requiredFields = [firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm];

    // Checks if all fields are filled out by the user
    if (!checkInput(firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm)) {
        // Returns true if checkbox was clicked, false if not
        let checked = privateForm != null;
        let coordinates = await get_lat_long(streetForm.value, zipcodeForm.value, cityForm.value);
if (coordinates === undefined) {
    errorLabel.innerText = "Could not find this adress!"

}
        // Created new Entry
        let new_contact = {


            "First Name": firstnameForm.value,
            "Last Name": lastnameForm.value,
            "Street & Number": streetForm.value,
            "ZIP": zipcodeForm.value,
            "City": cityForm.value,
            "Country": countryForm.value,
            "Phone": phoneForm.value,
            "Date of birth": dobForm.value,
            "Public Contact": checked,
            "Owner": currentUser.getName(),
            "lat": coordinates.lat,
            "lng": coordinates.lng


        }

        // Adds the new entry
        let response  = await fetch("http://localhost:3000/contacts", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_contact)
        });
       let  success = await response.ok;



        // Hides Form and displays the map again
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("addContactForm").style.display = "none";
        if (!success){
            alert("Kontakt konnte nicht hinzugefügt werden!")

        }
        loadContacts("my")


        // Clears input
        firstnameForm.value = "";
        lastnameForm.value = "";
        streetForm.value = "";
        zipcodeForm.value = "";
        cityForm.value = "";
        countryForm.value = "";
        phoneForm.value = "";
        dobForm.value = "";
        setCheckboxValue(privateForm, false);
        // Resets Error Text
        errorLabel.innerText = "";
    } else {
        errorLabel.innerText = "Please fill out all required fields!";
        requiredFields.forEach(element => {
            element.style.borderColor = "red";
        })
    }

}
// Update Contact Event -> Reads user input and calls updateContactServer func
document.getElementById("updateContactBtn").onclick = async function (event) {
    event.preventDefault();

    let firstnameForm = document.getElementById("firstNameU");
    let lastnameForm = document.getElementById("lastNameU");
    let streetForm = document.getElementById("streetAndNumberU");
    let zipcodeForm = document.getElementById("zipcodeU");
    let cityForm = document.getElementById("cityU");
    let countryForm = document.getElementById("countryU");
    let phoneForm = document.getElementById("phoneU");
    let dobForm = document.getElementById("dobU");
    let isPublic = document.getElementById("privateU")
    let errorLabel = document.getElementById("UpdateContactErrorLabel");


    const requiredFields = [firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm];

    // Checks if all fields are filled out by the user
    if (!checkInput(firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm)) {
        // Returns true if checkbox was clicked, false if not
        let coordinates = await get_lat_long(streetForm.value, zipcodeForm.value, cityForm.value);
        if (coordinates === undefined) {
            errorLabel.innerText = "Could not find this adress!"

        }
        // Created new Entry
        let new_contact = {


            "First Name": firstnameForm.value,
            "Last Name": lastnameForm.value,
            "Street & Number": streetForm.value,
            "ZIP": zipcodeForm.value,
            "City": cityForm.value,
            "Country": countryForm.value,
            "Phone": phoneForm.value,
            "Date of birth": dobForm.value,
            "Public Contact": isPublic.checked,
            "Owner":owner,
            "lat": coordinates.lat,
            "lng": coordinates.lng


        }

        // Adds the new entry
        await updateContact(new_contact);

        // Hides Form and displays the map again
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("updateContactForm").style.display = "none";

        // Clears input
        firstnameForm.value = "";
        lastnameForm.value = "";
        streetForm.value = "";
        zipcodeForm.value = "";
        cityForm.value = "";
        countryForm.value = "";
        phoneForm.value = "";
        dobForm.value = "";
        setCheckboxValue(isPublic, false);
        // Resets Error Text

        errorLabel.innerText = "";

        requiredFields.forEach(element => {
            element.style.borderColor = "black";
        })

    } else {
        errorLabel.innerText = "Please fill out all required fields!";
        requiredFields.forEach(element => {
            element.style.borderColor = "red";
        })
    }

}

// Loading all contacts
document.getElementById("showAllContactsBtn").onclick = async function () {
    await loadContacts("all");
}

// Loading contacts by user
document.getElementById("showMyContactsBtn").onclick = async function () {
    await loadContacts("my");
}

document.getElementById("backButtonAdd").onclick = function(event) {
    event.preventDefault();
    changeTitle("Adviz | Home")
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("addContactForm").style.display = "none";
}
document.getElementById("backButtonUpdate").onclick = function(event) {
    event.preventDefault();
    changeTitle("Adviz | Home")
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("updateContactForm").style.display = "none";

    setCheckboxValue(document.querySelector('.privateCheckboxU:checked'), false);
}
// Add Contact Event -> Shows the Add Contact Form
document.getElementById("addContactBtn").onclick = function (event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "grid";
    changeTitle("Adviz | Add Contact")


}
document.getElementById("deleteContactBtn").onclick = async function (event) {
    event.preventDefault();
    await deleteContact();
    document.getElementById("map_container").style.display = "grid";
    document.getElementById("updateContactForm").style.display = "none";
    changeTitle("Adviz | Home")

}





//helper functions
let changeTitle = (title) => {
    document.getElementById("title").innerText = title;
}

let get_lat_long =async (street, zip, city) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
            'X-RapidAPI-Key': '6d4ee9038amshd48d6b7ff082733p15d30ajsnf3fbcf93f965'
        }
    };
    let url = "https://trueway-geocoding.p.rapidapi.com/Geocode?address=" + street + "%20" + zip + "%20" + city + "&language=de"

    return await fetch(url, options)
        .then(response => response.json())
        .then(async response => {
            if (  response.results[0].location_type === "approximate"){
                return undefined;
            }
            else{
                return {lat : response.results[0].location["lat"],lng: response.results[0].location["lng"]}

            }
        }).catch(async () => {
            return undefined
        });

}

// Resets Checkbox value
function setCheckboxValue(checkbox,value) {
    if(checkbox === null) return false;

    if (checkbox.checked!==value)
        checkbox.click();
}
let update_field_read_only = (mode) => {
    if (mode){
        document.getElementById("updateContactBtn").style.display = "none";
        document.getElementById("deleteContactBtn").style.display = "none";
        document.getElementById("firstNameU").disabled = true;
        document.getElementById("lastNameU").disabled = true;
        document.getElementById("streetAndNumberU").disabled = true;
        document.getElementById("zipcodeU").disabled = true;
        document.getElementById("cityU").disabled = true;
        document.getElementById("countryU").disabled = true;
        document.getElementById("phoneU").disabled = true;
        document.getElementById("dobU").disabled = true;
        document.getElementById("privateU").disabled = true;
        document.getElementById("privateU").checked = true;
        document.getElementById("UpdateContactErrorLabel").disabled = true;
    }
    else{
        document.getElementById("updateContactBtn").style.display = "block";
        document.getElementById("deleteContactBtn").style.display = "block";
        document.getElementById("firstNameU").disabled = false;
        document.getElementById("lastNameU").disabled = false;
        document.getElementById("streetAndNumberU").disabled = false;
        document.getElementById("zipcodeU").disabled = false;
        document.getElementById("cityU").disabled = false;
        document.getElementById("countryU").disabled = false;
        document.getElementById("phoneU").disabled = false;
        document.getElementById("dobU").disabled = false;
        document.getElementById("privateU").disabled = false;

        document.getElementById("UpdateContactErrorLabel").disabled = false;
        document.getElementById("privateU").disabled = false;

    }

}



/**
 * Checks if required fields are filled out
 * @param firstnameForm first name input
 * @param lastnameForm last name input
 * @param streetForm street input
 * @param zipcodeForm zipcode input
 * @param cityForm city input
 * @returns {boolean} true if contains one or more empty fields
 */
let checkInput = (firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm) => {
    let fields = [
        firstnameForm.value,
        lastnameForm.value,
        streetForm.value,
        zipcodeForm.value,
        cityForm.value];
    return fields.includes("");
}




//Server Functions




/**
 * Gets contacts
 * server: /contacts (get)
 * @param mode for getting contacts(my or all)
 * @returns {Promise<any>} Array or null
 */
let getContact = async (mode) => {
    let url = ("http://localhost:3000/contacts?current_user="+currentUser.getName()+"&mode="+mode);

    return await fetch(url, {
        method: 'GET',
    }).then(response => response.json()).then(async response => {
        return (response)
    }).catch(async () => {
        return null
    })


}



/**
 * Updates a contact to the users contacts and reloads the contact list
 * server /contacts (put)
 * @param contactEntry updated contact
 */
let updateContact  = async (contactEntry) =>{
    if (last_updated_id!== -1){
        let response  = await fetch("http://localhost:3000/contacts/"+last_updated_id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactEntry)
        });
        if ( response.ok) {
            last_updated_id = -1;
            owner = null;

            await loadContacts("my");
        }
        else{
            alert("Der Kontakt konnte nicht geändert werden. Versuche es erneut!");
            last_updated_id = -1;
            owner = null;

            await loadContacts("my");

        }
    }



}





/**
 * deletes a contact  and reloads the contact list
 * server: /contacts (delete)
 */
let deleteContact = async () => {
    if (last_updated_id!== -1){
        let response  = await fetch("http://localhost:3000/contacts/"+last_updated_id, {
            method: 'DELETE',

        });
        if ( response.ok) {
            last_updated_id = -1;
            owner = null;

            await loadContacts("my");
        }
        else{
            alert("Der Kontakt konnte nicht gelöscht werden. Versuche es erneut!");
            last_updated_id = -1;
            owner = null;

            await loadContacts("my");

        }
    }

}
