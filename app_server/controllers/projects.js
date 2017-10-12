var passport = require('passport'),
    mongoose = require('mongoose'),
    Project = mongoose.model('project'),
    Match = mongoose.model('match');

// CREATE NEW PROJECT
module.exports.newProject = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        var project = new Project({
            createdBy : req.payload._id,
            name : req.body.name,
            createdAt : new Date(),
            tags : req.body.tags,
            description : req.body.description,
            region : req.body.region,
            function : req.body.function,
            industry : req.body.industry
        });
        project.save(function(err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send();
            }
        });
    }
};
// UPDATES PROJECT
module.exports.updateProject = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Project.findById(req.body._id, function(err, project) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                project.name = req.body.name;
                project.description = req.body.description;
                project.tags = req.body.tags;
                project.save(function (err) {
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
// RETURNS ALL USERS PROJECTS IN AN ARRAY
module.exports.getAllProjects = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Project.find({}, function(err, projects) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var projectMap = [];
                projects.forEach(function (project) {
                    if (project.createdBy.equals(req.payload._id)) {
                        projectMap.push(project);
                    }
                });
                res.send(projectMap);
            }
        });
    }
};
// GET ALL PROJECTS FOR THE BROWSE PAGE
module.exports.getAllProjectsBrowse = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Project.find({}, function(err, projects) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var projectsMap = {};
                projects.forEach(function (project) {
                    if (project.active)
                        projectsMap[project._id] = project;
                });
                res.status(200).send(projectsMap);
            }
        });
    }
};
// RETURNS A USERS PROJECT
module.exports.getProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(401).send({ "message" : "No such project." });
        } else {
            Project
                .findById(req.params.id)
                .exec(function(err, project) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (!project) {
                        res.status(401).send({ "message" : "No such project." });
                    } else {
                       res.status(200).send(project);
                    }
                });
        }
    }
};
// RETURNS A PUBLIC PROJECT
module.exports.showProject = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            res.status(401).send({ "message" : "No such project." });
        } else {
            Project
                .findById(req.params.id)
                .exec(function(err, project) {
                    if (err) {
                        res.status(500).send({ "message" : err.message });
                    } else if (!project) {
                        res.status(401).send({ "message" : "No such project." });
                    } else{
                        var outData = {
                            createdBy : project._id,
                            name : project.name,
                            createdAt : project.createdAt,
                            description : project.description,
                            imageURL : project.imageURL
                        };
                        res.status(200).json(outData);
                    }
                });
        }
    }
};
// DISABLES/ACTIVATES A PROJECT
module.exports.changedActiveStatusProject = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Project.findById(req.body._id, function(err, project) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                project.active = !project.active;
                project.save(function (err) {
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
// DELETES AN USERS PROJECT PERMANENTLY FROM THE DATABASE
module.exports.deleteProject = function(req, res) {
    if (!req.payload._id) {
        if (!req.payload.industrial) {
            res.status(401).send({ "message" : "Unauthorized: Not industrial partner." });
        } else {
            res.status(401).send({ "message" : "Unauthorized: Not logged in." });
        }
    } else {
        Project.findByIdAndRemove(req.params.id, function(err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                Match.find({ projectID : req.params.id }).remove(function(err) {
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