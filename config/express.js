var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    path = require('path'),
    cron = require('cron');

module.exports = function() {
    var app = express();

    // SET HTTPS RESPONSE HEADERS FOR SECURITY MEASURES
    app.use(function(req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('x-frame-options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        //res.setHeader('Content-Security-Policy', 'default-src \'self\'');
        //res.setHeader('Content-Security-Policy-Report-Only', 'default-src \'self\'; report-uri');

        // IE/Edge fix
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "Mon, 26 Jul 1997 05:00:00 GMT");

        res.removeHeader("X-Powered-By");
        next();
    });

    // SERVE STATIC FILES/UPLOADED CONTENT TO CLIENT
    app.use(express.static(path.join(__dirname, '..') + '/app_client'));
    app.use(express.static(path.join(__dirname, '..') + '/public'));
    app.use(express.static(path.join(__dirname, '..') + '/uploads'));

    // CONFIGURATION FOR PARSING BODY REQUESTS COMING FROM CLIENT
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(flash());

    // INITIALIZE PASSPORT
    app.use(passport.initialize());

    // REQUIRE THE FILE FOR API ROUTES AND APPLY IT
    var routesApi = require('../app_server/routes/index.js');
    app.use('/api', routesApi);

    // FALLBACK FOR HTML5MODE WHEN CLIENT REFRESHES SITE ETC
    app.get('*', function(req, res) {res.sendFile(path.join(__dirname, '..') + '/app_client/index.html');});

    // TIMED JOBS THAT EXECUTES AT SET INTERVALS TO PERFORM SERVER SIDE JOBS
    // MATCHING JOB RUNS EVERY 6 HOURS (AT 06:00, 12:00, 18:00 & 00:00
    // DELETION JOB RUNS ONCE EVERY DAY (AT 02:00)
    var cronJobMatching = cron.job("0 0 */6 * * *", function(){ require('../app_server/controllers/matching.js').performTimedMatching(); });
    var cronJobClearUsers = cron.job("0 0 2 * * *", function(){ require('../app_server/controllers/user.js').clearUnactivatedUsers(); });

    cronJobMatching.start();
    cronJobClearUsers.start();

    return app;
};