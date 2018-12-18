'use strict';
module.exports = {
    validateEmail: function(email) {
        const re = /^\S+@\S+\.\S+$/; // simple validation
        return re.test(email);
    },
    validatePassword: function(password) {
        return password.length >= 8; 
    },
    validateUsername: function(username) {
        return /^[a-zA-Z][A-Za-z0-9_]{5,}$/.test(username);
    },
    validatePhone: function(phone) {
        // front-end should make phone number in correct format
        const re = /^0[0-9]{9}$/; // mobile
        return phone == "" || re.test(phone) ;
    },
    validateLevel: num => 1 <= num <= 3,
    
}