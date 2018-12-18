'use strict';
const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const validator = require('../../util/validator');
const etype = require('../../util/errors').getErrorType;
const verifyToken = require('../../util/verifier'); 
const CONFIG = require('../../config');
const bodyChecker = require('../../util/bodyChecker');
const client = mongoose.createConnection(CONFIG.mongoIP);
const User = client.model('User', require('../../schemas').UserSchema);
const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: CONFIG.emailCred.user,
        pass: CONFIG.emailCred.password
    }
});

// pass User schema
// module.exports = function (User) {
let router = require('express').Router();

router.get('/', (req, res) => {
    return res.send('Hello from user');
})
router.post('/register', bodyChecker.post(['username', 'password', 'email', 'permissionLevel', 'phone', 'fullname']), (req, res) => {

    let {  username, password, email, permissionLevel, phone, fullname} = req.body;
    permissionLevel = parseInt(permissionLevel) || -1;
    // create new user to be saved

    let newUser = new User({
        username: username,
        email: email,
        permissionLevel: permissionLevel,
        phone: phone,
        fullname: fullname,
    });

    // user validation
    let error = newUser.validateSync();
    let err_fields = [];
    if (!validator.validatePassword(password)) err_fields.push("password");
    if (error){
        Object.keys(error.errors).forEach(key => {
            err_fields.push(key);
        })
    }
    if (err_fields.length > 0){
        console.log(`I: REGISTER: the fields ${err_fields} of ${newUser} is invalid format`);
        return res.status(400).send({
            success: false,
            message: "validation error",
            fields: err_fields
        })
    }

    // add password
    try {
        let hashedPassword = bcrypt.hashSync(password, 10),
            userSecret = bcrypt.hashSync(hashedPassword, 5); 
        newUser.password = hashedPassword;
        newUser.userSecret = userSecret;
    }
    catch (err) {
        console.error('E: REGISTER: Hashing password failed');
        console.error(err);
        return res.status(500).send('Something went wrong!');
    }
    // actually push in to DB
    User.create(newUser).then(user => {
        let token = jwt.sign({
            _id: user._id,
            sub: 'verify' // use to confirm email   
        },
        user.userSecret+CONFIG.serverSecret,{
            expiresIn: '1d'
        });
        let url = `http://localhost:3000/api/user/confirm?token=${token}`;
        // transporter.sendMail({
        //     to: email,
        //     from: 'no-reply-auth@test.com',
        //     html: `Hi ${email}<p>
        //     please confirm your registration by clicking this link<p>
        //     <a href="${url}">${url}</a>`
        // })
        console.log(`I: REGISTER: Successfully registered user ${newUser.email}`);
        return res.status(201).send('user creation success please check your email ' + url);
    }).catch(err => {
        // return res.send(err.errmsg)
        if (err.errmsg) {
            console.log(`I: REGISTER: tried to register when ${etype(err.errmsg)} = ${newUser[etype(err.errmsg)]} already exist`);
            // console.log(err);
            return res.status(400).send({
                success: false,
                message: "duplicate key error",
                fields: etype(err.errmsg)
            });
        }
        else {
            // Mongo Error, etc
            console.error(`E: REGISTER: Failed to register new user`);
            console.error(err);
            return res.status(500).send("Something went wrong!");
        }
    })

});

router.get('/confirm', bodyChecker.get(['token']) , async (req, res) => {
    let token = req.query.token;
    // console.log();
    verifyToken(token).then(result => {
        if (result.sub != 'verify'){
            return res.status(403).send('Invalid usage of token');
        } 
        else {
            User.findByIdAndUpdate(result._id, {
                confirmed: true,
            }).then(_ => {
                console.log(`I: CONFIRM: user ${_.username} has confirmed their registration`);
                return res.status(200).send('Confirmed your email, now you can login');
            }).catch(err => {
                console.error(`E: CONFIRM: failed to confirm ${result._id}'s registration`);
                console.error(err);
                return res.status(500).send('Something went wrong, please try again');
            });
        }

    }).catch(err => {
        console.error(`W: CONFIRM: verificaion of ${token} is failed`);
        console.error(err);
        return res.status(400).send("Invalid token");
    })
    // find user to get their token to decode
});

router.post('/login', bodyChecker.post(['username', 'password']), (req, res) => {
    const {username, password} = req.body;
    let condition = {};
    if (validator.validateEmail(username)) {
        condition.email = username;
    } else if (validator.validateUsername(username)){ 
        condition.username = username;
    } else {
        return res.status(400).send('Please use email/username login');
    }
    User.findOne(condition).then(user => {
        if (!user) return res.send("Invalid Username")
        bcrypt.compare(password, user.password).then(same => {
            if (same) {
                const token = jwt.sign({
                    _id: user._id,
                    sub: 'login',
                    // iat: Date.now();
                },
                user.userSecret+CONFIG.serverSecret,{
                    expiresIn: '1d'
                })
                return res.send("success: token is " + token);
            } else {
                return res.send("Invalid Password")
            }
        })
    }).catch(err => {
        console.log(err);
        return res.send('Mongo eror');
    })

})

router.post('/forgot-password', bodyChecker.post(['username', 'phone']), (req, res) => {
    let {username, phone} = req.body;
    let condition = {};
    if (validator.validateEmail(username)) {
        condition.email = username;
    } else if (validator.validateUsername(username)) { 
        condition.username = username;
    } else {
        return res.status(400).send('Please use email/username login');
    }
    console.log(condition)
    User.findOne(condition).then(user => {
        if (!user) return res.send('Invalid username');
        if (user.phone != phone) return res.send('Invalid phone');
        const token = jwt.sign({
            _id: user._id,
            sub: 'resetPassword'
        },
        user.userSecret+CONFIG.serverSecret,{
            expiresIn: '1d'
        })
        let url = `http://localhost:3000/api/user/reset-password?token=${token}`; // TODO: this should be reset password page
        //  transporter.sendMail({
        //     to: email,
        //     from: 'no-reply-auth@test.com',
        //     html: `Hi ${email}<p>
        //     please confirm your registration by clicking this link<p>
        //     <a href="${url}">${url}</a>`
        // })
        return res.send('password reset link sent to email ' + token);
    }).catch(err => {
        console.log(err);
        return res.send('something went wrong');
    }) 

});

router.post('/reset-password', bodyChecker.post(['token', 'newPassword']), (req, res) => {
    var {token, newPassword} = req.body;
    verifyToken(token).then(result => {
        console.log(result);
        if (result.sub != 'resetPassword'){ 
            return res.send("Invalid usage of token");
        } else {
            let hashedPassword = bcrypt.hashSync(newPassword, 10),
                userSecret = bcrypt.hashSync(hashedPassword, 5);
            User.findByIdAndUpdate(result._id, {
                password: hashedPassword,
                userSecret: userSecret
            }).then(_ => {
                return res.send('Password reset completed');
            }).catch(err => {
                console.log(err);
                return res.send('something went wrong');
            });

        }

    }).catch(err => {
        console.log(err);
        return res.send("Invalid Token");
    })
})

router.post('/change-password', bodyChecker.post(['token', 'password', 'newPassword']), (req, res) => {
    let {token, password, newPassword} = req.body;

    verifyToken(token).then(result => {
        if (result.sub != 'login'){ 
            return res.send("Invalid usage of token");
        }
        else {
            User.findById(result._id).then(user => {
                bcrypt.compare(password, user.password).then(same => {
                    if (!same){
                        return res.send('Invalid Password');
                    }
                    else {
                        let hashedPassword = bcrypt.hashSync(newPassword, 10),
                        userSecret = bcrypt.hashSync(hashedPassword, 5);
                        User.findByIdAndUpdate(result._id, {
                            password: hashedPassword,
                            userSecret: userSecret
                        }).then(_ => {
                            return res.send('Password changed');
                        }).catch(err => {
                            console.log(err);
                            return res.send('something went wrong');
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    return res.send('Something went wrong');
                })
            }).catch(err => {
                console.log(err);
                return res.send('Mongo error');
            })
        }
    }).catch(err => {
        console.log(err);
        return res.send('Invalid Token');
    })

});

router.get('/listall', (req, res) => {
    User.find({

    }, (err, users) => {
        if (err) {
            console.log(err);
            return res.send('something went wrong!');
        }
        else {
            // res.send(users.);
            let result = []
            users.forEach(user => {
                result.push(user);
            });
            return res.send(result);
        }
    });
});

router.get('/verifyToken', (req, res) => {
    return verifyToken(req.query.token).then(result => {
        return res.send(result);
    }).catch(err => {
        return res.send("error: " + err);
    });
})
// return router;
// }

module.exports = router;