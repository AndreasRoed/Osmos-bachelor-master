var passport = require('passport'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    nodeMailer = require('nodemailer'),
    config = require('../../config/config'),
    User = mongoose.model('user'),
    Invite = mongoose.model('invite');

// CREATES NEW USER AND LOGS THE USER IN
module.exports.newUser = function(req, res) {
    var user = new User({
        firstname : capitalizeFirstLetters(req.body.firstname),
        lastname : capitalizeFirstLetters(req.body.lastname),
        country : req.body.country,
        city : capitalizeFirstLetters(req.body.city),
        zipcode : req.body.zipcode,
        address : capitalizeFirstLetters(req.body.address),
        email : req.body.email.toLowerCase(),
        academic : req.body.academic,
        industrial : req.body.industrial,
        createdAt : new Date(),
        gender : req.body.gender,
        about : req.body.about,
        born : req.body.born,
        job_place : req.body.job_place,
        job_title : req.body.job_title,
        subscription: req.body.subscription,
        phone: req.body.phone,
        companyname: capitalizeFirstLetters(req.body.companyname)
    });
    user.setPassword(req.body.password);
    user.generateActivationToken();

    user.save(function(err) {
        if (err) {
            res.status(500).send({ "message" : err.message });
        } else {
            res.status(200).send();
            sendActivationEmail(user, req.headers.host, function(err) {
                if (err) {
                    console.log('Attention: Not able to send confirmation email to ' + user.email + ' at ' + new Date());
                }
            });
        }
    });
};
// ACTIVATES A NEW USERS ACCOUNT
module.exports.activateUser = function(req, res) {
    User.findOne({ activateAccountToken: req.params.token }, function(err, user) {
        if (err) {
            res.status(500).send({ "message" : err.message });
        } else if (!user) {
            res.status(401).send({ "message" : "Token is invalid. Contact osmos.no.reply@gmail.com for help." });
        } else {
            user.activateAccountToken = undefined;
            user.activateAccountExp = undefined;
            user.disabled = false;

            user.save(function(err) {
                var token = user.generateJwt();
                res.status(200).send({ token: token });
            });
        }
    });
};
// CHANGES PASSWORD FOR USER
module.exports.changePassword = function(req, res) {
    if (req.payload._id !== req.body._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        User.findById(req.body._id, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else if (user.pwdSalt != null && !user.authenticate(req.body.oldPassword)) {
                res.status(500).send({ "message": "Wrong old password." });
            } else {
                user.setPassword(req.body.newPassword);
                user.save(function(err) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        res.status(200).send();
                    }
                });
            }
        });
    }
};
// UPDATES USER
module.exports.updateUser = function(req, res) {
    if (req.payload._id !== req.body._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        User.findById(req.body._id, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                user.firstname = capitalizeFirstLetters(req.body.firstname);
                user.lastname = capitalizeFirstLetters(req.body.lastname);
                user.country = req.body.country;
                user.city = capitalizeFirstLetters(req.body.city);
                user.zipcode = req.body.zipcode;
                user.address = capitalizeFirstLetters(req.body.address);
                user.about = req.body.about;
                user.gender = req.body.gender;
                user.born = req.body.born;
                user.job_place = req.body.job_place;
                user.job_title = req.body.job_title;
                user.phone = req.body.phone;
                user.companyname = req.body.companyname;
                user.subscription = req.body.subscription;
                user.industrial = req.body.industrial;
                user.academic = req.body.academic;

                user.save(function (err) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        var token;
                        token = user.generateJwt();
                        res.status(200).send({ token: token });
                    }
                });
            }
        });
    }
};
// RETURNS ARRAY WITH ALL REGISTERED USER (LIMITED INFORMATION) FOR SEARCHING
module.exports.searchUsers = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        User.find({}, function(err, users) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var userMap = [];
                users.forEach(function (user) {
                    if (!user.disabled) {
                        userMap.push({
                            _id: user._id,
                            name: user.firstname + " " + user.lastname,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            imageURL: user.imageURL,
                            city: user.city,
                            country: user.country,
                            job_title: user.job_title,
                            job_place: user.job_place,
                            companyname: user.companyname,
                            academic: user.academic,
                            industrial: user.industrial
                        });
                    }
                });
                res.status(200).send(userMap);
            }
        });
    }
};
// LOGS USER IN
module.exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info){
        if (err) {
            res.status(500).send({ "message" : err.message });
        } else if(user){
            var token;
            token = user.generateJwt();
            res.status(200).send({ token: token });
        } else {
            res.status(500).send(info);
        }
    })(req, res);
};
// FETCHES A USERS PROFILE
module.exports.getProfile = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Private profile." });
    } else {
        User
            .findById(req.payload._id)
            .exec(function(err, user) {
                if (err) {
                    res.status(500).send({ "message" : err.message });
                } else if (!user) {
                    res.status(500).send({ "message" : "No user found." });

                } else {
                    var returnUser = {
                        _id : user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        country: user.country,
                        city: user.city,
                        zipcode: user.zipcode,
                        address: user.address,
                        email: user.email,
                        subscription: user.subscription,
                        gender: user.gender,
                        phone: user.phone,
                        about: user.about,
                        education: user.education,
                        degree: user.degree,
                        languages: user.languages,
                        interests: user.interests,
                        newsletter: user.newsletter,
                        public_profile: user.public_profile,
                        born: user.born,
                        companyname: user.companyname,
                        job_place: user.job_place,
                        job_title: user.job_title,
                        userLevel: user.userLevel,
                        admin: user.admin,
                        academic: user.academic,
                        industrial: user.industrial,
                        disabled: user.disabled,
                        createdAt: user.createdAt,
                        imageURL: user.imageURL,
                        pwdSalt: user.pwdSalt
                    };
                    res.status(200).send(returnUser);
                }
            });
    }
};
// RETURNS A USERS PUBLIC PROFILE
module.exports.showProfile = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(401).send({ "message" : "No such user." });
        } else {
            User
                .findById(req.params.id)
                .exec(function(err, user) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (!user) {
                        res.status(401).send({ "message" : "No such user." });
                    } else{
                        var outData = {
                            name : user.firstname + ' ' + user.lastname,
                            country : user.country,
                            imageURL : user.imageURL,
                            industrial : user.industrial,
                            academic : user.academic,
                            companyname : user.companyname
                        };
                        res.status(200).json(outData);
                    }
                });
        }
    }
};
// TIMED FUNCTION TO CLEAR ALL USERS THAT REGISTER BUT DO NOT ACTIVATE THEIR ACCOUNT WITHIN A DAY
module.exports.clearUnactivatedUsers = function() {
    User.find({ disabled: true,  activateAccountExp: { $lt: Date.now() } }).remove(function(err, users) {
        if (err) {
            console.log('Error when trying to delete ' + users.length + ' un-activated users at ' + new Date() + '.');
        } else {
            if (users.result.n === 0) {
                console.log('No un-activated users to delete at ' + new Date() + '.');
            } else {
                console.log(users.result.n + ' un-activated users successfully deleted at ' + new Date() + '.');
            }
        }
    });
};
module.exports.inviteUser = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        User.findOne({ email : req.body.email }, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else if (user) {
                res.status(500).send({ "message" : "User is already registered at this site" });
            } else {
                Invite.findOne({ email : req.body.email }, function(err, invite) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (invite) {
                        var today = new Date();
                        var day = 1000 * 60 * 60 * 24;
                        if (Math.round((today.getTime() - invite.invitedAt.getTime())/day) < 14) {
                            res.status(500).send({ "message" : "User already invited less then 14 days ago" });
                        } else {
                            invite.invitedAt = new Date();
                            invite.save();
                            res.status(200).send();
                            sendInvitationEmail(req.body.email, req.body.byFirstName, req.body.byLastName, req.headers.host);
                        }
                    } else {
                        var inv = new Invite({
                            email : req.body.email,
                            invitedAt : new Date()
                        });
                        inv.save(function(err) {
                            if (err) {
                                res.status(500).send({ "message" : err.message });
                            } else {
                                res.status(200).send();
                                sendInvitationEmail(req.body.email, req.body.byFirstName, req.body.byLastName, req.headers.host);
                            }
                        });
                    }
                });
            }
        });
    }};
// FUNCTION TO SEND OUT ACTIVATION EMAIL TO NEW USERS
var sendActivationEmail = function(user, host, callback) {
    var token = user.activateAccountToken;
    var smtpTransport = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.resetEmail,
            pass: config.resetEmailPass
        }
    });
    var mailOptions = {
        to: user.email,
        from: config.resetEmail,
        subject: 'Account Activation',
        text: 'You are receiving this because you (or someone else) have tried to make an account at Osmos using your email.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'https://' + host + '/activate/' + token + '\n\n'
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
            callback(new Error('Error sending activation email'));
        } else {
            callback(null);
        }
    });
};
// FUNCTION TO SEND OUT INVITE EMAIL TO POTENTIAL USERS
var sendInvitationEmail = function(receiver, senderFirst, senderLast, host) {
    var smtpTransport = nodeMailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.resetEmail,
            pass: config.resetEmailPass
        }
    });
    var mailOptions = {
        to: receiver,
        from: config.resetEmail,
        subject: 'Account Activation',
        text: 'You have recieved an invite from ' + senderFirst + ' ' + senderLast + ' to join Osmos.\n\n' +
        'Please click on the following link, or paste this into your browser to check out the site:\n\n' +
        'https://' + host + '/' + '\n\n'
    };
    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
        } else {
        }
    });
};
// FUNCTION TO CAPITALIZE THE FIRST LETTER OF ALL THE WORDS IN A STRING
var capitalizeFirstLetters = function(str) {
    if(str && str.length > 0)
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    else return "";
};