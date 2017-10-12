var mongoose = require('mongoose');

module.exports = function() {
    var user = mongoose.model('user');
    require('./strategies/local.js')(); // STRATEGY FOR LOCAL AUTHENTICATION
};