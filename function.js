import {User} from "/data/user.js";
import {ContactEntry} from "./data/contactEntry.js";
let map;
let marker;
let markerList = [];
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
        'X-RapidAPI-Key': '6d4ee9038amshd48d6b7ff082733p15d30ajsnf3fbcf93f965'
    }
};

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

let addMarker = (user, lat, lng) => {

    marker = new google.maps.Marker({
        position: {lat: lat, lng: lng},
        map: map,
        label: user.getFullName()
    });



    markerList.push([user,marker])


}
let removeMark = (user)=>{
    for (let i = 0; i < markerList.length ; i++) {
        if(markerList[i][0] === user    ){
            markerList[i][1].setMap(null);
            markerList= markerList.filter(X=> X[0] !== user);

        }

    }
}
window.onload = function() {
    // After load up -> Only Login screen is visible
    document.getElementById("map_container").style.display = "none";
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("updateContactForm").style.display = "none";

}

// Available User Logins (Hardcoded)
let admina = new User("admina", "password", "admin");
let normalo = new User("normalo", "password", "normal")

let availableUsers = [admina, normalo];

// Current User (overwritten after login)
let currentUser = new User();
// Contacts (Hardcoded)
let contact1_admina = new ContactEntry("Unknown", "User(A)", "Treskowallee 8", "10318", "Berlin", "Germany", 353637437, "1990-06-04",  true);
let contact2_admina = new ContactEntry("John", "Doe(A)", "Wilhelminenhofstraße 75A", "12459", "Berlin", "Germany", 6436377, "1990-04-07", false );
let contact1_normalo = new ContactEntry("Dennis", "Doe(N)", "Straße des 17. Juni 135", "10623", "Berlin", "Germany", 353637437, "1990-06-04", true);
let contact2_normalo = new ContactEntry("Piet", "Doe(N)", "Kaiserswerther Str. 16-18", "14195 ", "Berlin", "Germany", 88325652, "1990-06-04",true);

// Adding contacts to their user
admina.addContact(contact1_admina);
admina.addContact(contact2_admina);
normalo.addContact(contact1_normalo);
normalo.addContact(contact2_normalo);

// Forms
let loginForm = document.getElementById("login");
let username = document.getElementById("usernameLabel");
let password = document.getElementById("passwordLabel");

// Events
document.getElementById("loginBtn").onclick = function() {
    let errorMessage = document.getElementById("loginErrorMessage");
    let error = "";

    let userValue = username.value;
    let passwordValue = password.value;

    if(validateUser(userValue, passwordValue)) {
        changeTitle("Adviz | Home");
        loadContacts("my");
    }
    // Possible error cases
    else if(!userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Please enter your login details."
        errorMessage.innerText = error;
        username.style.borderColor = "red";
        password.style.borderColor = "red";
    }
    else if(userValue && !passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Password Field can't be empty!"
        errorMessage.innerText = error;
        password.style.borderColor = "red";
    }
    else if(!userValue && passwordValue) {
        username.style.borderColor = "white";
        password.style.borderColor = "white";
        error = "Username Field can't be empty!"
        errorMessage.innerText = error;
        username.style.borderColor = "red";
    }
    else {
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
document.getElementById("showAllContactsBtn").onclick = function() {
    loadContacts("all");
}

// Loading contacts by user
document.getElementById("showMyContactsBtn").onclick = function() {
    loadContacts("my");
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
 * @param user username
 * @param pass password
 * @returns {boolean} true if login was successful, false if not
 */
let validateUser = (user, pass) => {
    if(user === "admina" && pass === "password" || user === "normalo" && pass === "password") {
        currentUser = user === "admina" ? admina : normalo;
        loginForm.style.display = "none";

        initMap();
        document.getElementById("map_container").style.display = "grid";
        document.getElementById("welcomeMessage").innerText = "Welcome, " + currentUser.getName() + ". Role: " + currentUser.getRole();
        return true;
    }
    return false;
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
    loadContacts("my");
}

/**
 * Updates the HTML List based on the saved contacts data
 * @param contactEntry new contact
 */
let updateList = (contactEntry) => {
    let newEntry = document.createElement("LI");
    newEntry.classList.add('contactsListItem');
    newEntry.innerHTML = '<a href="#"><i class="fa-solid fa-address-card"></i> ' + contactEntry.getFullName() + '</a>'
    document.getElementById("cList").appendChild(newEntry);



    // Adds onClickEvents for each item in the List
    let listItems  = document.querySelectorAll("ul li");
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
let loadContacts = (mode) => {
    document.getElementById("cList").innerHTML = "";
    switch(mode) {
        case "my":
            let contactList = currentUser.getContacts()
            for(let i = 0; i < contactList.length; i++) {
                let user = contactList[i]
                updateList(user);
                setMarkerOfUser(user)

            }
            let intersect = markerList.filter(X=> !contactList.includes(X[0]) ).flatMap(X=> X[0])
            if(intersect.length !== 0){
                intersect.forEach(elem =>{
                    removeMark(elem);
                })
            }
            break;
        case "all":
            if(currentUser.getRole() === "admin") {
                availableUsers.forEach(element => {
                    element.getContacts().forEach(element => {
                        updateList(element);
                        setMarkerOfUser(element);

                    })
                });
            }
            else{
                availableUsers.forEach(element => {
                    element.getContacts().forEach(element => {
                        if(element.isPublic() || currentUser.getContacts().includes(element)){
                            updateList(element);
                            setMarkerOfUser(element);
                        }


                    })
                });


            }
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


