var passport = require('passport'),
    mongoose = require('mongoose'),
    Tag = mongoose.model('tags'),
    Project = mongoose.model('project'),
    Research = mongoose.model('research'),
    async = require('async');

// RETURNS ALL TAGS IN AN ARRAY
module.exports.getAllTagsAdmin = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Tag.find({}, function (err, tags) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var tagsMap = [];
                tags.forEach(function (tag) {
                    tagsMap.push(tag);
                });
                res.status(200).send(tagsMap);
            }
        });
    }
};
// APPROVES AN UNAPPROVED TAG
module.exports.approveTag = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        Tag.findById(req.body._id, function(err, tag) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                tag.approved = true;
                tag.save(function (err) {
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
// DELETES A TAG FROM THE DATABASE
module.exports.deleteTag = function(req, res) {
    if (!req.payload.admin) {
        res.status(401).send({ "message" : "Unauthorized: Admin access required." });
    } else {
        Tag.findByIdAndRemove(req.params.id, function(err, tag) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                Project.find({}, function(err, projects) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        projects.forEach(function (project) {
                            project.tags.pull(tag._id);
                            project.save(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                }
                            });
                        });
                    }
                });
                Research.find({}, function(err, researches) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else {
                        researches.forEach(function (research) {
                            research.tags.pull(tag._id);
                            research.save(function (err) {
                                if (err) {
                                    res.status(500).send({ "message" : err.message });
                                }
                            });
                        });
                    }
                });
                res.status(200).send();
            }
        });
    }
};
// DELETES A TAG FROM A PROJECT
module.exports.deleteProjectTag = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Project.findById(req.params.projectID, function (err, project) {
            if (err) {
                res.status(500).send({"message": err.message});
            } else {
                project.tags.pull(req.params.tagID);
                project.save(function (err) {
                    if (err) {
                        res.status(500).send({"message": err.message});
                    } else {
                        res.status(200).send();
                    }
                });
            }
        });
    }
};
// DELETES A TAG FROM A RESEARCH
module.exports.deleteResearchTag = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.academic) {
            res.status(401).send({ "message" : "Unauthorized: Not Academic partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Research.findById(req.params.researchID, function (err, research) {
            if (err) {
                res.status(500).send({"message": err.message});
            } else {
                research.tags.pull(req.params.tagID);
                research.save(function (err) {
                    if (err) {
                        res.status(500).send({"message": err.message});
                    } else {
                        res.status(200).send();
                    }
                });
            }
        });
    }
};
// RETURNS ALL APPROVED TAGS TO A USER TO CREATE PROJECT/RESEARCH
module.exports.getAllApprovedTags = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Tag.find({}, function (err, tags) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var tagsMap = [];
                tags.forEach(function (tag) {
                    if (tag.approved) {
                        tagsMap.push(tag);
                    }
                });
                res.send(tagsMap);
            }
        });
    }
};
// ADDS ALL TAGS TO DATABASE, IF IT DOES NOT ALREADY EXIST, AND RETURNS ALL TAG ID'S IN AN ARRAY
module.exports.addTags = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        async.map(req.body, function (key, next) {
            Tag.findOne({name: key.name.toLowerCase()}, function (err, result) {
                if (err) {
                    res.status(500).send({ "message" : err.message });
                } else if (!result) {
                    var newTag = new Tag({'name': key.name});
                    newTag.save(function (err, newObj) {
                        if (err) {
                            res.status(500).send({ "message" : err.message });
                        } else {
                            next(err, newObj);
                        }
                    });
                } else {
                    result.timesUsed++;
                    result.save();
                    next(err, result);
                }
            });
        }, function (err, result) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send(result);
            }
        });
    }
};