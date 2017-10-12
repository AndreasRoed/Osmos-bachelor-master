var passport = require('passport'),
    mongoose = require('mongoose'),
    Research = mongoose.model('research'),
    Projects = mongoose.model('project'),
    User = mongoose.model('user'),
    path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf');

// RETURNS ALL USERS IN AN ARRAY
module.exports.getAllUsers = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        User.find({}, function(err, users) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var userMap = [];
                users.forEach(function (user) {
                    userMap.push({
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        imageURL: user.imageURL,
                        companyname: user.companyname,
                        academic: user.academic,
                        industrial: user.industrial,
                        admin: user.admin,
                        disabled: user.disabled,
                        createdAt: user.createdAt
                    });
                });
                res.status(200).send(userMap);
            }
        });
    }
};
// RETURNS ALL RESEARCHES
module.exports.getAllResearch = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        Research.find({}, function(err, researches) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var researchMap = [];
                researches.forEach(function (research) {
                    researchMap.push(research);
                });
                res.status(200).send(researchMap);
            }
        });
    }
};
// RETURNS ALL PROJECTS
module.exports.getAllProjects = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        Projects.find({}, function(err, projects) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var projectsMap = [];
                projects.forEach(function (project) {
                    projectsMap.push(project);
                });
                res.status(200).send(projectsMap);
            }
        });
    }
};
// DISABLES/ENABLES AN USERS ACCOUNT
module.exports.changedEnabledStatusUser = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        User.findById(req.body._id, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                user.disabled = !user.disabled;
                user.save(function (err) {
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
// GIVES/TAKES AWAY ADMIN STATUS TO AN USERS ACCOUNT
module.exports.changeAdminStatusUser = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        User.findById(req.body._id, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                user.admin = !user.admin;
                user.save(function (err) {
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
// DELETES AN USERS ACCOUNT PERMANENTLY FROM THE DATABASE, ALSO DELETES PROFILE PICTURES AND PROJECTS IF INDUSTRIAL PARTNER
module.exports.deleteUser = function(req, res) {
    if (!req.payload.admin && (req.payload._id !== req.params.id)) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        User.findByIdAndRemove(req.params.id, function(err, user) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var baseDirPicture = path.join(__dirname, '../..') + '/uploads/profile_pictures/';
                var deleteDirPicture = baseDirPicture + '/' + req.params._id;
                rimraf(deleteDirPicture, function(err) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        if (user.academic) {
                            res.status(200).send();
                            /* DO WE WANT TO DELETE RESEARCH OR NOT ?
                            Research.find({ createdBy : user._id }).remove(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                } else {
                                    var baseDirResearch = path.join(__dirname, '../..') + '/uploads/research/';
                                    var deleteDirResearch = baseDirResearch + '/' + req.payload._id;
                                    rimraf(deleteDirResearch, function(err) {
                                        if (err) {
                                            res.status(500).send({ "message" : err.message });
                                        } else {
                                            res.status(200).send();
                                        }
                                    });
                                }
                            });
                            */
                        } else if (user.industrial) {
                            Projects.find({ createdBy : user._id }).remove(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                } else {
                                    res.status(200).send();
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};