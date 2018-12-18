const Schema = require('mongoose').Schema;
const validator = require('./util/validator');
module.exports = {
    UserSchema: new Schema({
        email: {
            type: String,
            required: true,
            index: {
                background: false,
                unique: true
            },
            validate: validator.validateEmail
        },
        confirmed: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
        },
        createdAt: {
            type: Date,
        },
        expiresIn: {
            type: Schema.Types.Mixed,
            index: {
                background: false,
                expires: '1d'
            },
            // type can de either Date or String "None"
        }
        // personalInfo: PersonalInfo
    })
}
