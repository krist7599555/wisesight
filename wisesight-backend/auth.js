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
    host: 'smtp.gmail.com',
    connectionTimeout: "7000",
    auth: {
        user: CONFIG.emailCred.username,
        pass: CONFIG.emailCred.password
    }
});


let router = require('express').Router();

router.get('/', (req, res) => {
    return res.status(200).send({
        success: true,
        msg: 'Hello from user'
    });
})
router.post('/register',
    bodyChecker.post(['password', 'email']),
    (req, res) => {

        let { password, email } = req.body;

        // create new user to be saved
        let newUser = new User({
            email: email,
            confirmed: false,
            createdAt: Date.now()
        });
        newUser.expiresIn = newUser.createdAt;
        // user validation
        let error = newUser.validateSync();
        let err_fields = [];
        if (!validator.validatePassword(password)) err_fields.push("password");
        if (error) {
            Object.keys(error.errors).forEach(key => {
                err_fields.push(key);
            });
        }
        if (err_fields.length > 0) {
            console.log(`I: REGISTER: the fields ${err_fields} of ${newUser} is invalid format`);
            return res.status(400).send({
                success: false,
                msg: "validation error",
                fields: err_fields
            });
        }

        // add password
        try {
            let hashedPassword = bcrypt.hashSync(password, 10);
            newUser.password = hashedPassword;
        }
        catch (err) {
            console.error('E: REGISTER: Hashing password failed', err);
            return res.status(500).send({
                success: false,
                msg: 'Something went wrong!',
            });
        }
        // actually push in to DB
        User.create(newUser).then(user => {
            let token = jwt.sign({
                _id: user._id,
                sub: 'verify' // use to confirm email   
            },
                user.password + CONFIG.serverSecret, {
                    expiresIn: '1d'
                });
            let url = `${CONFIG.apiUrl}/api/user/confirm?token=${token}`;
            transporter.sendMail({
                to: email,
                subject: "Comfirming your registration",
                html: `Hi ${email}<p>
                please confirm your registration by clicking this link<p>
                <a href="${url}">${url}</a>`
            })
            console.log(`I: REGISTER: Successfully registered user ${newUser.email}`);
            return res.status(201).send({
                success: true,
                msg: 'user creation success please check your email ',
            });
        }).catch(err => {
            if (err.errmsg) {
                console.log(`I: REGISTER: tried to register when ${etype(err.errmsg)} = ${newUser[etype(err.errmsg)]} already exist`);
                // console.log(err);
                return res.status(400).send({
                    success: false,
                    msg: "duplicate key error",
                    fields: etype(err.errmsg)
                });
            }
            else {
                // Mongo Error, etc
                console.error(`E: REGISTER: Failed to register new user`, err);
                return res.status(500).send({
                    success: false,
                    msg: "Something went wrong!"
                });
            }
        }).catch(err => {
            console.error('E: LOGIN: Hash error');
            console.error(err);
            return res.status(500).send({
                success: false,
                msg: "Something went wrong!"
            });
        })
    }
);

router.get('/confirm',
    bodyChecker.get(['token']),
    verifyToken('get'),
    async (req, res) => {
        let payload = req.query.payload;
        console.log(`I: confirm: invalid usage of token`)
        if (payload.sub != 'verify') return res.status(403).send({
            success: false,
            msg: 'Invalid usage of token'
        });
        User.findByIdAndUpdate(payload._id, {
            confirmed: true,
            expiresIn: "Never"
        }).then(_ => {
            console.log(`I: CONFIRM: user ${_.email} has confirmed their registration`);
            return res.status(200).send({
                success: true,
                msg: 'Confirmed your email, now you can login'
            });
        }).catch(err => {
            console.error(`E: CONFIRM: failed to confirm ${payload._id}'s registration`, err);
            return res.status(500).send({
                success: false,
                msg: 'Something went wrong, please try again'
            });
        });
    }
);

router.post('/login',
    bodyChecker.post(['email', 'password']),
    (req, res) => {
        const { email, password } = req.body;
        let condition = { email: email };
        User.findOne(condition).then(user => {
            if (!user) return res.status(401).send({
                success: false,
                msg: "Invalid credentials"
            }); // most likely invalid email
            bcrypt.compare(password, user.password).then(same => {
                if (same) {
                    if (!user.confirmed) return res.status(403).send({
                        success: false,
                        msg: 'Please confirm you registration before login'
                    });
                    const token = jwt.sign({
                        _id: user._id,
                        sub: 'login',
                        // iat: Date.now();
                    },
                        user.password + CONFIG.serverSecret, {
                            expiresIn: '1d'
                        })
                    return res.status(200).send({
                        success: true,
                        msg: "token is ",
                        token: token
                    });
                } else {
                    console.log(`D: LOGIN: incorrect attempt to login ${email}:${password}`);
                    return res.status(401).send({
                        success: false,
                        msg: "Invalid Password"
                    })
                }
            }).catch(err => {
                console.error('E: LOGIN: Hash error', err);
                return res.status(500).send({
                    success: false,
                    msg: 'Something went wrong!'
                });
            })
        }).catch(err => {
            console.error('E: LOGIN: DB error', err);
            return res.status(500).send({
                success: false,
                msg: 'Something went wrong!'
            });
        })

    }
)


router.post('/resend-mail',
    bodyChecker.post(['email']),
    (req, res) => {

        let { email } = req.body;
        let condition = {
            email: email,
        };
        console.debug(condition);

        User.findOne(condition).then(user => {
            if (!user) return res.status(401).send({
                success: false,
                msg: 'Invalid credentials'
            }); // most likely invalid email/
            const token = jwt.sign({
                _id: user._id,
                sub: 'verify'
            },
                user.password + CONFIG.serverSecret, {
                    expiresIn: '1d'
                })

            let url = `${CONFIG.apiUrl}/api/user/confirm?token=${token}`;
            transporter.sendMail({
                to: email,
                subject: "Comfirming your registration",
                html: `Hi ${email}<p>
                please confirm your registration by clicking this link<p>
                <a href="${url}">${url}</a>`
            })
            console.log(`I: RESEND-MAIL: re-sent mail to ${user.email}`);
            return res.status(200).send({
                success: true,
                msg: 'verification mail re-sent'
            });
        }).catch(err => {
            console.error(`E: resent-mail: ${err}`)
            return res.status(500).send({
                success: false,
                msg: 'something went wrong'
            });
        })

    }
);

router.post('/forgot-password',
    bodyChecker.post(['email']),
    (req, res) => {

        let { email } = req.body;
        let condition = {
            email: email,
        };
        console.debug(condition);

        User.findOne(condition).then(user => {
            if (!user) return res.status(401).send({
                success: false,
                msg: 'Invalid credentials'
            }); // most likely invalid email/
            const token = jwt.sign({
                _id: user._id,
                sub: 'resetPassword'
            },
                user.password + CONFIG.serverSecret, {
                    expiresIn: '1d'
                })

            let url = `128.199.216.159:1992/#/reset-password?token=${token}`; // TODO: this should be reset password page
            transporter.sendMail({
                to: email,
                subject: "Password reset",
                html: `Hi ${email}<p>
                Hi, ${user.email}, Reset your password by clicking this link <p>
                <a href="${url}">${url}</a>
                if you didn't request the password reset you can ignore this email`
            })
            return res.status(200).send({
                success: false,
                msg: 'password reset link sent to email '
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                success: false,
                msg: 'something went wrong'
            });
        })

    });

router.post('/reset-password',
    bodyChecker.post(['token', 'newPassword']),
    verifyToken('post'),
    (req, res) => {
        var { payload, newPassword } = req.body;
        if (!validator.validatePassword(newPassword))
            return res.status(400).send({
                success: false,
                msg: 'new password is incorrect format'
            });

        let hashedPassword = bcrypt.hashSync(newPassword, 10),
            userSecret = bcrypt.hashSync(hashedPassword, 5);
        User.findByIdAndUpdate(payload._id, {
            password: hashedPassword,
            userSecret: userSecret
        }).then(_ => {
            return res.status(200).send({
                success: true,
                msg: 'Password reset completed'
            });
        }).catch(err => {
            console.log(err);
            return res.status(500).send({
                success: false,
                msg: 'something went wrong'
            });
        });
    })

router.post('/change-password',
    bodyChecker.post(['token', 'password', 'newPassword']),
    verifyToken('post'),
    (req, res) => {
        let { payload, password, newPassword } = req.body;

        User.findById(payload._id).then(user => {
            bcrypt.compare(password, user.password).then(same => {
                if (!same) {
                    return res.status(401).send({
                        success: false,
                        msg: 'Invalid password'
                    }); // most likely invalid password
                }
                else {
                    let hashedPassword = bcrypt.hashSync(newPassword, 10);
                    User.findByIdAndUpdate(payload._id, {
                        password: hashedPassword,
                    }).then(_ => {
                        return res.status(200).send({
                            success: true,
                            msg: 'Password changed'
                        });
                    }).catch(err => {
                        console.log(err);
                        return res.status(500).send({
                            success: false,
                            msg: 'something went wrong'
                        });
                    });
                }
            }).catch(err => {
                console.error('E: ChangePassword: ', err);
                return res.status(500).send({
                    success: false,
                    msg: 'Something went wrong'
                }); // most likely hashing error
            })
        }).catch(err => {
            console.error('E: ChangePassword:', err);
            return res.status(500).send({
                success: false,
                msg: 'Something went wrong!'
            }); // most likely mongo error
        })
    }
);
/*
router.get('/listall', (req, res) => {
    User.find({

    }, (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('something went wrong!');
        }
        else {
            let result = []
            users.forEach(user => {
                result.push(user);
            });
            return res.status(200).send(result);
        }
    });
});

router.get('/verifyToken',
    bodyChecker.get(['token']),
    verifyToken('get'),
    (req, res) => {
        return res.send(req.query.payload);
    }
)
*/
module.exports = router;
