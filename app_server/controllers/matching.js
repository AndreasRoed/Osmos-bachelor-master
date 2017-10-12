var passport = require('passport'),
    mongoose = require('mongoose'),
    Project = mongoose.model('project'),
    Research = mongoose.model('research'),
    Match = mongoose.model('match');

// PERFORMS MATCHES
module.exports.performMatching = function (req, res) {
    Project.find({}, function(err, projects) {
        if (err) {
            res.status(500).send({ "message" : err.message });
        } else {
            Research.find({}, function(err, research) {
                if (err) {
                    res.status(500).send({ "message" : err.message });
                } else {
                    if (matchingAlgorithm(projects, research)) {
                        res.status(200).send();
                    } else {
                        res.status(500).send({ "message" : "Error performing matches." });
                    }
                }
            });
        }
    });
};
// RETURN MATCHES BASED ON PROJECT
module.exports.getMatchesProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Match.find({ projectID : req.params.id }, function(err, projects) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else if (projects.length == 0) {
                res.status(500).send({ "message": "No matches yet." });
            } else {
                res.status(200).send(projects);
            }
        });
    }
};
// RETURN MATCHES BASED ON RESEARCH
module.exports.getMatchesResearch = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Match.find({ researchID : req.params.id }, function(err, research) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else if (research.length == 0) {
                res.status(500).send({ "message": "No matches yet." });
            } else {
                res.status(200).send(research);
            }
        });
    }
};
// TIMED FUNCTION FOR PERFORMING MATCHES
module.exports.performTimedMatching = function () {
    Project.find({}, function(err, projects) {
        if (err) {
            return err;
        } else {
            Research.find({}, function(err, research) {
                if (err) {
                    return err;
                } else {
                    return matchingAlgorithm(projects, research);
                }
            });
        }
    });
};
// MATCHING ALGORITHM
var matchingAlgorithm = function(projects, research) {
    // LOOPS THROUGH EVERY PROJECT IN THE DATABASE AND THEN EVERY RESEARCH FOR EVERY PROJECT TO COMPARE PERCENTAGE OF MATCHING TAGS
    projects.forEach(function(project) {
        if (project.active) {
            var numOfTags = project.tags.length;
            research.forEach(function(research) {
                if (research.active) {
                    var matchedTags = [];
                    project.tags.forEach(function(pTag) {
                        research.tags.forEach(function(rTag) {
                            if (pTag.equals(rTag)) {
                                matchedTags.push(pTag);
                            }
                        })
                    });
                    var matchingPercent = matchedTags.length / numOfTags * 100;
                    // ONLY SAVE MATCHES ABOVE A CERTAIN PERCENTAGE (50)
                    if (matchingPercent >= 50) {
                        // CHECKS IF A MATCH ALREADY EXISTS BETWEEN THE CURRENT PROJECT AND RESEARCH
                        Match.findOne({ 'researchID' : research._id, 'projectID' : project._id }).exec(function(err, match) {
                            if (err) {
                                console.log(err);
                            } else if (!match) {
                                var newMatch = new Match({
                                    researchID : research._id,
                                    projectID : project._id,
                                    matchingPercent : matchingPercent,
                                    matchedAt : new Date,
                                    matchedTags : matchedTags
                                });
                                newMatch.save(function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
    console.log('Matching successfully ran at ' + new Date() + '.');
    return true;
};