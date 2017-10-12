// HERE GOES ALL VARIABLES
module.exports = {
    port: 443, // Port for HTTPS Server
    redirectPort: 80, // To redirect to HTTPS
    db: 'mongodb://heroku_340bl4r1:8fa9bq90957f65lgfkmcqr3me7@ds023674.mlab.com:23674/heroku_340bl4r1', // Local Link to Mongo Database - DO NOT CHANGE THE OSMOS PART (DB NAME)
    secret: 'super.duper.secret.FTW', // JSONWebToken Encryption Secret
    fbAppSecret: '7072cd9ec589a86afb7cc1ee93cb2b85', // Facebook App Secret
    liClientSecret: 'WVMv9iavA9zYTznX', // LinkedIn Client Secret
    liClientID: '77a19gf2dpnlkp', // LinkedIn Client ID
    liRedirectURL1: 'https://localhost', // Redirect URL LinkedIn Local
    liRedirectURL2: 'https://shielded-depths-54090.herokuapp.com', // Redirect URL LinkedIn Deployed
    resetEmail: 'osmos.no.reply@gmail.com', // GMAIL Login
    resetEmailPass: 'osmososmos' // GMAIL Password
};