var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    request = require('request'),
    config = require('../../config/config');

module.exports.loginLinkedIn = function(req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    var params = {
        code: req.body.code,
        client_id: config.liClientID,
        client_secret: config.liClientSecret,
        redirect_uri: "",
        grant_type: 'authorization_code'
    };
    if (req.headers.host.indexOf('localhost') > -1) {
        params.redirect_uri = config.liRedirectURL1;
    } else {
        params.redirect_uri = config.liRedirectURL2;
    }
    request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
        if (response.statusCode !== 200) {
            res.status(400).send({ "message" : body.error_description });
        } else {
            var params = {
                oauth2_access_token: body.access_token,
                format: 'json'
            };
            request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {
                if (err) {
                    res.status(500).send({ err: err.message });
                } else {
                    User.findOne({ providerLiId: profile.id }, function(err, existingUser) {
                        if (err) {
                            res.status(500).send({ err: err.message });
                        } else {
                            if (existingUser) {
                                var token = existingUser.generateJwt();
                                return res.status(200).send({token: token});
                            } else {
                                User.findOne({ email: profile.emailAddress }, function(err, existingUserEmail) {
                                    if (err) {
                                        res.status(500).send({ err: err.message });
                                    } else {
                                        if (existingUserEmail) {
                                            if (existingUserEmail.disabled == true && existingUserEmail.activateAccountToken.length > 0) {
                                                existingUserEmail.disabled = false;
                                                existingUserEmail.activateAccountToken = undefined;
                                                existingUserEmail.activateAccountExp = undefined;
                                            }
                                            existingUserEmail.providerLiId = profile.id;
                                            existingUserEmail.providerLiData = profile;
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
                                                firstname: profile.firstName,
                                                lastname: profile.lastName,
                                                email: profile.emailAddress,
                                                academic: false,
                                                industrial: false,
                                                disabled: false,
                                                createdAt: new Date(),
                                                providerLiId: profile.id,
                                                providerLiData: profile
                                            });
                                            if (req.body.state == 11111111) {
                                                user.industrial = true;
                                                user.companyname = user.firstname + " " + user.lastname;
                                            } else if(req.body.state == 22222222) {
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
                }
            });
        }
    });
};
