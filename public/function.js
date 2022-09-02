import {User} from "/data/user.js";
import {ContactEntry} from "./data/contactEntry.js";

let map;
let marker;
let markerList = [];
let marker_dict = {

}
let currentUser;
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
        'X-RapidAPI-Key': '6d4ee9038amshd48d6b7ff082733p15d30ajsnf3fbcf93f965'
    }
};
let res;
// Inits the map screen
let initMap = () => {
    const loader = new google.maps.plugins.loader.Loader({
        apiKey: "AIzaSyBF0SvLTZkO3pThLmyHnkOrWLCBsWG3ikE",
        version: "weekly",
        libraries: ["drawing"]
    });


    loader.load().then(() => {
        map = new google.maps.Map(document.getElementById("mapFrame"), {
            center: {lat: 52.520008, lng: 13.404954},
            zoom: 15,
        });
    });
}

let setMarkerOfUser = async (user)=> {
    let filter = markerList.filter(X => X[0] === user)

    if (filter.length === 0) {

        let url = "https://trueway-geocoding.p.rapidapi.com/Geocode?address=" + user.getStreet() + "%20" + user.getZipcode() + "%20" + user.getCity() + "&language=de"
        return fetch(url, options)
            .then(response => response.json())
            .then(async response => {
                await addMarker(user, response.results[0].location["lat"], response.results[0].location["lng"])
                return true
            }).catch(async err => {
                return false
            });

    }
}
/**
 * Adds a new marker to the map
 * @param user Label shown on the marker
 * @param lat latitude
 * @param lng longitude
 */

let addMarker = (name, lat, lng) => {
    if (!(marker_dict.hasOwnProperty(name))) {
        marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: map,
            label: name
        });
    }



    marker_dict[name] = marker;


}
let removeMark = (user)=>{
    if (marker_dict[user] !== undefined){
        marker_dict[user].setMap(null);
        delete marker_dict[user];



    }
}
window.onload = function() {
    // After load up -> Only Login screen is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";

}



// Forms
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");

// Events
document.getElementById("loginBtn").onclick = async function () {
    let errorMessage = document.getElementById("loginErrorMessage");
    let error = "";

    let userValue = username.value;
    let passwordValue = password.value;
    let validation = await validateUser(userValue, passwordValue);

    if (validation === true) {
        loginForm.style.display = "none";

        initMap();
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.getName() + ". Role: " + currentUser.getRole();
        changeTitle("Adviz | Home");
        loadContacts("my");
    }
    // Possible error cases
    else if (!userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Please enter your login details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
    } else if (userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Password Field can't be empty!"
        errorMessage.innerText = error;
        password.style.borderColor = "red";
    } else if (!userValue && passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Username Field can't be empty!"
        errorMessage.innerText = error;
        username.style.borderColor = "red";
    } else {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Wrong Login Details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
    }
}
// Add Contact Event -> Shows the Add Contact Form
document.getElementById("addContactBtn").onclick = function (event) {
    event.preventDefault();
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "grid";
    changeTitle("Adviz | Add Contact")


}
// Add Contact Event -> Reads user input and calls addContact func
document.getElementById("addButton").onclick = function(event) {
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
    if(!checkInput(firstnameForm, lastnameForm, streetForm, zipcodeForm, cityForm)) {
        // Returns true if checkbox was clicked, false if not
        let checked = privateForm != null;
        // Created new Entry
        let newEntry = new ContactEntry(
            firstnameForm.value,
            lastnameForm.value,
            streetForm.value,
            zipcodeForm.value,
            cityForm.value,
            countryForm.value,
            phoneForm.value,
            dobForm.value,
            checked
        );
        // Adds the new entry
        addContact(newEntry);

        // Hides Form and displays the map again
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("addContactForm").style.display = "none";

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
    }
    else {
        errorLabel.innerText = "Please fill out all required fields!";
        requiredFields.forEach(element => {
            element.style.borderColor = "red";
        })
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


// Resets Checkbox value
function setCheckboxValue(checkbox,value) {
    if(checkbox === null) return false;

    if (checkbox.checked!==value)
        checkbox.click();
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

/**
 * Validates login data and initiates the contact list loading
 * @param name username
 * @param pass password
 * @returns {boolean} true if login was successful, false if not
 */
let validateUser = async (name, pass) => {



    let url = "http://localhost:3000/users"
    let contact = {
        "name" : name,
        "password":pass
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

    let data = await response.json();
    if(response.ok) {
        currentUser = new User(data.username, data.password, data.role);
        return true;
    }
    else {
        return false;

    }




}

/**
 * Adds a contact to the users contacts and reloads the contact list
 * @param contactEntry new contact
 */
let addContact = async (contactEntry) => {
    let res = await setMarkerOfUser(contactEntry)
    if (res === true)
        currentUser.addContact(contactEntry);
    else if (res === false)
        alert("Der Kontakt: "+contactEntry.getFullName()+" konnte nicht hínzugefügt werden (Ungültige Adresse).")
    await loadContacts("my");
}

/**
 * Updates the HTML List based on the saved contacts data
 * @param contactEntry new contact
 */
let updateList = (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.classList.add('contactsListItem');
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry.name +" "+contactEntry.lastname  + '</a>'
    document.getElementById("cList").appendChild(newEntry);



    // Adds onClickEvents for each item in the List
    let listItems  = document.querySelectorAll("c# li");
    listItems.forEach(function(item) {
        item.onclick = function() {
            let savedUser = currentUser.getContacts().find(o => o.getFullName() === this.innerText);
            if(!savedUser) {
                savedUser = availableUsers.find(o => o.getName() !== currentUser.getName()).getContacts().find(o => o.getFullName() === this.innerText)
            }
            updateContact(savedUser);
        }
    });
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
            let contacts = await get_contact("my");
            let all_users = Object.keys(marker_dict);
            if ( all_users.length !== 0){
                for (let i = 0; i < all_users.length; i++) {
                    if (!(all_users[i] in contacts)) {
                        removeMark(all_users[i]);

                    }

                }

            }
        for (const element of contacts) {

            await updateList(element);
            await addMarker((element.name +" "+element.lastname),element.lat,element.lng);




        }

            break;
        case "all":
            let contacts2 = await get_contact("all");
            contacts2.forEach(element => {

                    updateList(element);
                    addMarker((element.name +" "+element.lastname),element.lat,element.lng);
            });

            break;
    }
    changeTitle("Adviz | Home")
}

let updateContact = (ContactEntry) => {

    changeTitle("Adviz | Update Contact")

    document.getElementById("map_container").style.display = "none";
    document.getElementById("updateContactForm").style.display = "grid";
    // Showing data
    document.getElementById("firstNameU").value = ContactEntry.getName();
    document.getElementById("lastNameU").value = ContactEntry.getLastname();
    document.getElementById("streetAndNumberU").value = ContactEntry.getStreet();
    document.getElementById("zipcodeU").value = ContactEntry.getZipcode();
    document.getElementById("cityU").value = ContactEntry.getCity();
    document.getElementById("countryU").value = ContactEntry.getCountry();
    document.getElementById("phoneU").value = ContactEntry.getPhone();
    document.getElementById("dobU").value = ContactEntry.getDateOfBirth();
    let box = document.getElementById("privateU")
    if(ContactEntry.isPublic()) {
        setCheckboxValue(box, ContactEntry.isPublic());
    }
}

let changeTitle = (title) => {
    document.getElementById("title").innerText = title;
}

let get_lat_long =async (street, zip, city) => {
    let url = "https://trueway-geocoding.p.rapidapi.com/Geocode?address=" + street + "%20" + zip + "%20" + city + "&language=de"

    return await fetch(url, options)
        .then(response => response.json())
        .then(async response => {

            return [response.results[0].location["lat"], response.results[0].location["lng"]]
        }).catch(async err => {
            return null
        });

}
let get_contact = async (mode) => {
    let url = ("http://localhost:3000/contacts?current_user="+currentUser.getName()+"&mode="+mode);

    return await fetch(url, {
        method: 'GET',
    }).then(response => response.json()).then(async response => {
        return (response)
    }).catch(async err => {
        return null
    })


}
