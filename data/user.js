
class User {

    constructor(name, password, role, contacts = []) {
        this._name = name;
        this._password = password;
        this._role = role;
        this._contacts = contacts;
    }
    getName = () => {
        return this._name;
    }
    getRole = () => {
        return this._role;
    }
    getContacts = () => {
        return this._contacts;
    }
    
    addContact = (ContactEntry) => {
        this._contacts.push(ContactEntry);
    }
}


export {User};

