var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport');

var db = mongoose().connection,
    app = express(),
    pass = passport();

db.on('error', function(err) {
    if (err.name === 'MongoError') {
        console.log('No database connection found...');
        console.log('Shutting down...');
        process.exit();
    }});

db.once('open', function() {
    console.log("Connected to database...");
    app.listen(process.env.PORT || 80);
});

module.exports = app;