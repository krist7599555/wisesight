const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const CONFIG = require('../config');
const schemas = require('../schemas');

const client = mongoose.createConnection(CONFIG.mongoIP);
const User = client.model('User', schemas.UserSchema);

// return result only when signature is valid and correct password
module.exports = async function(token) {
    try {
        let _id = jwt.decode(token)._id || 'err';
        if (_id == 'err') throw new Error('Invalid payload')
        try {
            let user = await User.findById(_id);
            return jwt.verify(token, user.userSecret+CONFIG.serverSecret, (err, payload) => {
                if (err) throw err;
                return payload; 
            })
        }
        catch (err) {
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
}