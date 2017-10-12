var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);
    // ALL MODEL FILES MUST BE REQUIRED HERE
    require('../app_server/models/users.js');
    require('../app_server/models/projects.js');
    require('../app_server/models/research.js');
    require('../app_server/models/tags.js');
    require('../app_server/models/criteria.js');
    require('../app_server/models/matches.js');
    require('../app_server/models/invites.js');
    return db;
};