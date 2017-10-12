var passport = require('passport'),
    mongoose = require('mongoose'),
    Research = mongoose.model('research'),
    path = require('path'),
    fs = require('fs'),
    rimraf = require('rimraf'),
    Match = mongoose.model('match');

// CREATE NEW RESEARCH
module.exports.newResearch = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        var research = new Research({
            createdBy : req.payload._id,
            name : req.body.name,
            createdAt : new Date(),
            tags : req.body.tags,
            description : req.body.description,
            type : req.body.type
        });
        research.save(function(err, newResearch) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send(newResearch);
            }
        });
    }
};
// UPDATES RESEARCH
module.exports.updateResearch = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.findById(req.body._id, function(err, research) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                research.name = req.body.name;
                research.description = req.body.description;
                research.tags = req.body.tags;
                research.save(function (err) {
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
// RETURNS ALL USERS RESEARCH IN AN ARRAY
module.exports.getAllResearch = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.find({}, function(err, researches) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var researchMap = [];
                researches.forEach(function (research) {
                    if (research.createdBy.equals(req.payload._id)) {
                        researchMap.push(research);
                    }
                });
                res.send(researchMap);
            }
        });
    }
};
// GET ALL RESEARCH FOR THE BROWSE PAGE
module.exports.getAllResearchBrowse = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Research.find({}, function(err, researches) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var researchMap = {};
                researches.forEach(function (research) {
                    if (research.active)
                        researchMap[research._id] = research;
                });
                res.status(200).send(researchMap);
            }
        });
    }
};
// RETURNS A USERS RESEARCH
module.exports.getResearch = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(401).send({ "message" : "No such research." });
        } else {
            Research
                .findById(req.params.id)
                .exec(function(err, research) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (!research) {
                        res.status(401).send({ "message" : "No such research." });
                    } else {
                        res.status(200).send(research);
                    }
                });
        }
    }
};
// RETURNS A PUBLIC RESEARCH
module.exports.showResearch = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(401).send({ "message" : "No such research." });
        } else {
            Research
                .findById(req.params.id)
                .exec(function(err, research) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (!research) {
                        res.status(401).send({ "message" : "No such research." });
                    } else{
                        var outData = {
                            createdBy : research._id,
                            name : research.name,
                            createdAt : research.createdAt,
                            description : research.description,
                            imageURL : research.imageURL
                        };
                        res.status(200).json(outData);
                    }
                });
        }
    }
};
// DELETES AN USERS RESEARCH PERMANENTLY FROM THE DATABASE
module.exports.deleteResearch = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var baseDir = path.join(__dirname, '../..') + '/uploads/research/';
                var deleteDir = baseDir + '/' + req.payload._id + '/' + req.params.id;
                rimraf(deleteDir, function(err) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        Match.find({ researchID : req.params.id }).remove(function(err) {
                            if (err) {
                                res.status(500).send({ "message" : err.message });
                            } else {
                                res.status(200).send();
                            }
                        });
                    }
                });
            }
        });
    }
};
// DISABLES/ACTIVATES AN USERS RESEARCH
module.exports.changedActiveStatusResearch = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.findById(req.body._id, function(err, research) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                research.active = !research.active;
                research.save(function (err) {
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
// DELETES AN DOCUMENT FROM A SPECIFIED RESEARCH PERMANENTLY FROM THE DATABASE
module.exports.deleteDocument = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.findById(req.params.researchID, function(err, research) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                research.documentURLs.forEach(function (URL) {
                    if (URL._id == req.params.documentID) {
                        var baseDir = path.join(__dirname, '../..') + '/uploads';
                        var deleteFile = baseDir + URL.URL;
                        fs.unlink(deleteFile);
                    }
                });
                research.documentURLs.pull({_id: req.params.documentID});
                research.save(function (err) {
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