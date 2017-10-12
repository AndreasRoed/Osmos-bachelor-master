var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    country: { type: String },
    city: { type: String },
    zipcode: { type: Number },
    address: { type: String },
    email: { type: String, required: true, unique: true, trim: true },
    subscription: { type: Boolean, default: false },
    gender: { type: String },
    phone: { type: Number },
    about: { type: String },
    education: { type: String },
    degree: { type: String },
    languages: { type: String },
    interests: [{
        type: Schema.ObjectId,
        ref: 'tags'
    }],
    newsletter: { type: Boolean, default: false },
    public_profile: { type: Boolean, default: false },
    born: { type: Date, default: '' },
    companyname: { type: String },
    job_place: { type: String },
    job_title: { type: String },
    userLevel: { type: Number, required: true, default: 1 },
    admin: { type: Boolean, default: false },
    academic: { type: Boolean, required: true },
    industrial: {type: Boolean, required: true },
    disabled: { type: Boolean, required: true, default: true },
    createdAt: { type: Date, required: true },
    imageURL: { type: String, default: 'images/empty_profile.png'},
    pwdHash: String,
    pwdSalt: String,
    providerFbId: String,
    providerFbData: {},
    providerLiId: String,
    providerLiData: {},
    activateAccountToken: String,
    activateAccountExp: Date,
    resetPasswordToken: String,
    resetPasswordExp: Date
});
// GENERATES A RANDOM ACTIVATION TOKEN
UserSchema.methods.generateActivationToken = function(){
    var expiry = new Date();
    this.activateAccountToken = crypto.randomBytes(16).toString('hex');
    this.activateAccountExp = expiry.setDate(expiry.getDate() + 1);
};
// SETS A USERS PASSWORD (HASHED & SALTED)
UserSchema.methods.setPassword = function(password){
    this.pwdSalt = crypto.randomBytes(16).toString('hex');
    this.pwdHash = crypto.pbkdf2Sync(password, this.pwdSalt, 1000, 64).toString('hex');
};
// COMPARES USER INPUT WITH STORED PASSWORD HASH & SALT
UserSchema.methods.authenticate = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.pwdSalt, 1000, 64).toString('hex');
    return this.pwdHash === hash;
};
// GENERATES JSON WEB TOKEN FOR USER AFTER SUCCESSFUL LOGIN
UserSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 3);
    return jwt.sign({
        _id: this._id,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        admin: this.admin,
        academic: this.academic,
        industrial: this.industrial,
        userLevel: this.userLevel,
        imageURL: this.imageURL,
        companyname: this.companyname,
        exp: parseInt(expiry.getTime() / 1000)
    }, config.secret);
};
mongoose.model('user', UserSchema);