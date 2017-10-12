var multer = require('multer'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    User = mongoose.model('user'),
    Research = mongoose.model('research'),
    Project = mongoose.model('project');

// UPLOADS RESEARCH FILES TO SERVER
module.exports.uploadResearch = function(req, res) {
    if (!req.payload._id || !req.payload.academic) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        uploadResearchSub(req, res, function (err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send();
            }
        })
    }
};
// UPLOADS PROFILE PICTURES TO SERVER
module.exports.uploadPicture = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        uploadPictureSub(req, res, function (err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send();
            }
        })
    }
};
// UPLOADS PROJECT PICTURES TO SERVER
module.exports.uploadProjectPicture = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        uploadProjectPictureSub(req, res, function (err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send();
            }
        })
    }
};
// UPLOADS RESEARCH PICTURES TO SERVER
module.exports.uploadResearchPicture = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        uploadResearchPictureSub(req, res, function (err) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                res.status(200).send();
            }
        })
    }
};
var storageResearch = multer.diskStorage({
    destination: function (req, file, cb) {
        var baseDir = path.join(__dirname, '../..') + '/uploads/research/';
        var userDir = baseDir + req.body.userID;
        var projectDir = userDir + '/' + req.body.projectID;

        var stat = null;
        try { stat = fs.statSync(baseDir) } catch(err) { fs.mkdirSync(baseDir) }
        try { stat = fs.statSync(userDir) } catch(err) { fs.mkdirSync(userDir) }
        try { stat = fs.statSync(projectDir) } catch(err) { fs.mkdirSync(projectDir) }

        cb(null, projectDir);
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var regexp = new RegExp('#([^\\s]*)','g');
        var filename = file.originalname.substring(0, file.originalname.lastIndexOf('.')) + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];

        storeResearchUrl(req, file, datetimestamp);
        cb(null, filename.replace(regexp, ''))
    }
});
var storagePicture = multer.diskStorage({
    destination: function (req, file, cb) {
        var baseDir = path.join(__dirname, '../..') + '/uploads/';
        var subBaseDir = baseDir + 'profile_pictures';
        var userDir = subBaseDir + '/' + req.body.userID;

        var stat = null;
        try { stat = fs.statSync(baseDir) } catch(err) { fs.mkdirSync(baseDir) }
        try { stat = fs.statSync(subBaseDir) } catch(err) { fs.mkdirSync(subBaseDir) }
        try { stat = fs.statSync(userDir) } catch(err) { fs.mkdirSync(userDir) }

        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        if (!file.originalname.includes("_thumb")) {
            storeImageUrl(req.body.userID, file);
        }
        cb(null, req.body.userID + file.originalname);
    }
});
var storageProjectPicture = multer.diskStorage({
    destination: function (req, file, cb) {
        var baseDir = path.join(__dirname, '../..') + '/uploads/projects';
        var userDir = baseDir + '/' + req.body.userID;
        var projectDir = userDir + '/' + req.body.projectID;

        var stat = null;
        try { stat = fs.statSync(baseDir) } catch(err) { fs.mkdirSync(baseDir) }
        try { stat = fs.statSync(userDir) } catch(err) { fs.mkdirSync(userDir) }
        try { stat = fs.statSync(projectDir) } catch(err) { fs.mkdirSync(projectDir) }

        cb(null, projectDir);
    },
    filename: function (req, file, cb) {
        if (!file.originalname.includes("_thumb")) {
            storeProjectImageUrl(req.body.projectID, req.body.userID, file);
        }
        cb(null, req.body.projectID + file.originalname);
    }
});
var storageResearchPicture = multer.diskStorage({
    destination: function (req, file, cb) {
        var baseDir = path.join(__dirname, '../..') + '/uploads/research';
        var userDir = baseDir + '/' + req.body.userID;
        var researchDir = userDir + '/' + req.body.researchID;

        var stat = null;
        try { stat = fs.statSync(baseDir) } catch(err) { fs.mkdirSync(baseDir) }
        try { stat = fs.statSync(userDir) } catch(err) { fs.mkdirSync(userDir) }
        try { stat = fs.statSync(researchDir) } catch(err) { fs.mkdirSync(researchDir) }

        cb(null, researchDir);
    },
    filename: function (req, file, cb) {
        if (!file.originalname.includes("_thumb")) {
            storeResearchImageUrl(req.body.researchID, req.body.userID, file);
        }
        cb(null, req.body.researchID + file.originalname);
    }
});
var uploadResearchSub = multer({ //multer settings
    storage: storageResearch
}).single('file');
var uploadPictureSub = multer({ //multer settings
    storage: storagePicture
}).single('file');
var uploadProjectPictureSub = multer({ //multer settings
    storage: storageProjectPicture
}).single('file');
var uploadResearchPictureSub = multer({ //multer settings
    storage: storageResearchPicture
}).single('file');

// DECIDES LOCATION OF UPLOADED RESEARCH FILES
var storeResearchUrl = function(req, filename, datetimestamp) {
    var tempFilename = filename.originalname.substring(0, filename.originalname.lastIndexOf('.')) + '-' + datetimestamp + '.' + filename.originalname.split('.')[filename.originalname.split('.').length -1];
    var regexp = new RegExp('#([^\\s]*)','g');

    var newDocURL = {
        URL : '/research/' + req.body.userID + '/' + req.body.projectID + '/' + tempFilename.replace(regexp, ''),
        name : filename.originalname.replace(regexp, '')
    };
    Research.findByIdAndUpdate(
        req.body.projectID,
        {$push: {"documentURLs": newDocURL}},
        {safe: true},
        function(err) {
            if (err) {
                console.log(err);
            }
        }
    );
};
// DECIDES LOCATION OF UPLOADED PROFILE PICTURES
var storeImageUrl = function(id, file) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            user.imageURL = '/profile_pictures/' + id + '/' + id + file.originalname;
            user.save();
        }
    });
};
// DECIDES LOCATION OF UPLOADED PROJECT PICTURES
var storeProjectImageUrl = function(id, userID, file) {
    Project.findById(id, function(err, project) {
        if (err) {
            console.log(err);
        } else {
            project.imageURL = '/projects/' + userID + '/' + id + '/' + id + file.originalname;
            project.save();
        }
    });
};
// DECIDES LOCATION OF UPLOADED RESEARCH PICTURES
var storeResearchImageUrl = function(id, userID, file) {
    Research.findById(id, function(err, research) {
        if (err) {
            console.log(err);
        } else {
            research.imageURL = '/research/' + userID + '/' + id + '/' + id + file.originalname;
            research.save();
        }
    });
};