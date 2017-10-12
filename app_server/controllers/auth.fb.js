var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    config = require('../../config/config'),
    crypto = require('crypto');

// LOGS USER IN WITH FACEBOOK AUTHENTICATION, CREATES USER IN DATABASE IF IT DOES NOT EXISTS
module.exports.loginFacebook = function(req, res, next) {
    var profile = req.body.profile;
    var signedRequest = req.body.signedRequest;
    var encodedSignature = signedRequest.split('.')[0];
    var payload = signedRequest.split('.')[1];
    var appSecret = config.fbAppSecret;

    var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
    expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (encodedSignature !== expectedSignature) {
        res.status(400).send({ "message" : "Invalid request signature." });
    }
    User.findOne({ providerFbId: profile.id }, function(err, existingUser) {
        if (err) {
            res.status(500).send({ err: err.message });
        } else {
            if (existingUser) {
                var token = existingUser.generateJwt();
                return res.status(200).send({token: token});
            } else {
                User.findOne({ email: profile.email }, function(err, existingUserEmail) {
                    if (err) {
                        res.status(500).send({ err: err.message });
                    } else {
                        if (existingUserEmail) {
                            if (existingUserEmail.disabled == true && existingUserEmail.activateAccountToken.length > 0) {
                                existingUserEmail.disabled = false;
                                existingUserEmail.activateAccountToken = undefined;
                                existingUserEmail.activateAccountExp = undefined;
                            }
                            existingUserEmail.providerFbId = profile.id;
                            existingUserEmail.providerFbData = profile;
                            existingUserEmail.save(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                } else {
                                    var token;
                                    token = existingUserEmail.generateJwt();
                                    res.status(200).send({ token: token });
                                }
                            });
                        } else {
                            var user = new User({
                                firstname: profile.first_name,
                                lastname: profile.last_name,
                                email: profile.email,
                                academic: false,
                                industrial: false,
                                disabled: false,
                                createdAt: new Date(),
                                providerFbId: profile.id,
                                providerFbData: profile
                            });
                            if (req.body.type == 1) {
                                user.industrial = true;
                                user.companyname = user.firstname + " " + user.lastname;
                            } else if (req.body.type == 2) {
                                user.academic = true;
                            }
                            user.save(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                } else {
                                    var token = user.generateJwt();
                                    res.status(200).send({token: token});
                                }
                            });
                        }
                    }
                });
            }
        }
    });
};