var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    async = require('async'),
    crypto = require('crypto'),
    nodeMailer = require('nodemailer'),
    config = require('../../config/config');

// SENDS EMAIL WITH TOKEN TO RESET PASSWORD
module.exports.forgotPassword = function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            res.status(500).send({ "message" : err.message });
        } else if (!user)  {
            res.status(500).send({ "message" : "Unknown user" });
        } else {
            async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function(token, done) {
                    User.findOne({ email: req.body.email }, function(err, user) {
                        if (err) {
                            res.status(500).send({ "message" : err.message });
                        } else if (!user) {
                            return done(null, false);
                        } else {
                            user.resetPasswordToken = token;
                            var expiry = new Date();
                            expiry.setDate(expiry.getDate() + 1);
                            user.resetPasswordExp = expiry; // 1 day
                            user.save(function(err) {
                                done(err, token, user);
                            });
                        }
                    });
                },
                function(token, user, done) {
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
                        subject: 'Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'https://' + req.headers.host + '/reset/' + token + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function(err, info) {
                        if (err) {
                            res.status(500).send({ "message" : err.message });
                        } else  {
                            res.status(200).send({ "message" : "Email sent to " + req.body.email });
                        }
                    });
                }
            ], function(err) {
                if (err) return next(err);
            });
        }
    });
};
// RESETS PASSWORD IF TOKEN IS OK AND LOGS USER IN
module.exports.resetPassword = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExp: { $gt: Date.now() } }, function(err, user) {
                if (err) {
                    res.status(500).send({ "message" : err.message });
                } else if (!user) {
                    res.status(401).send({ "message" : "Token is bad or has expired!" });
                } else {
                    user.setPassword(req.body.password);

                    user.resetPasswordToken = undefined;
                    user.resetPasswordExp = undefined;

                    user.save(function(err) {
                        var token = user.generateJwt();
                        res.status(200).send({ token: token });
                        done(err, user);
                    });
                }
            });
        },
        function(user, done) {
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
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err, info) {
                if (err) {
                    res.status(500).send({ "message" : err.message });
                } else  {
                    res.status(200).send();
                }
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
};