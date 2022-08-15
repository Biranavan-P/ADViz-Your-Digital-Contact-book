class ContactEntry {

    constructor(name, lastname, street, zipcode, city, country, phone, dateOfBirth, isPublic) {
        this._name = name;
        this._lastname = lastname;
        this._street = street;
        this._zipcode = zipcode;
        this._city = city;
        this._country = country;
        this._phone = phone;
        this._dateOfBirth = dateOfBirth;
        this._isPublic = isPublic;
    }

    getFullName = () => {
        return this._name + " " + this._lastname;
    }
    getName = () => {
        return this._name;
    }
    getLastname = () => {
        return this._lastname;
    }
    getStreet = () => {
        return this._street;
    }
    getZipcode = () => {
        return this._zipcode;
    }
    getCity = () => {
        return this._city;
    }
    getCountry = () => {
        return this._country;
    }
    getPhone = () => {
        return this._phone;
    }
    getDateOfBirth = () => {
        return this._dateOfBirth;
    }
    isPublic = () => {
        return this._isPublic;
    }
}

export {ContactEntry};