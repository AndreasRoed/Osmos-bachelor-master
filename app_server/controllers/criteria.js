var mongoose = require('mongoose'),
    Function = mongoose.model('functions'),
    Industry = mongoose.model('industries'),
    Region = mongoose.model('regions'),
    Types = mongoose.model('types'),
    async = require('async');

// RETURNS ALL FUNCTIONS IN AN ARRAY
module.exports.getFunctions = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Function.find({}, function (err, func) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var funcMap = [];
                func.forEach(function (f) {
                    funcMap.push(f);
                });
                res.send(funcMap);
            }
        });
    }
};
// RETURNS ALL REGIONS IN AN ARRAY
module.exports.getRegions = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Region.find({}, function (err, reg) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var regionMap = [];
                reg.forEach(function (r) {
                    regionMap.push(r);
                });
                res.send(regionMap);
            }
        });
    }
};
// RETURNS ALL INDUSTRIES IN AN ARRAY
module.exports.getIndustries = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Industry.find({}, function (err, ind) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var industryMap = [];
                ind.forEach(function (i) {
                    industryMap.push(i);
                });
                res.send(industryMap);
            }
        });
    }
};
// RETURNS ALL TYPES IN AN ARRAY
module.exports.getTypes = function(req, res) {
    if (!req.payload._id) {
        res.status(401).send({ "message" : "Unauthorized: Not logged in." });
    } else {
        Types.find({}, function (err, type) {
            if (err) {
                res.status(500).send({ "message" : err.message });
            } else {
                var typeMap = [];
                type.forEach(function (t) {
                    typeMap.push(t);
                });
                res.send(typeMap);
            }
        });
    }
};
// FUNCTION TO CREATE, AND POPULATE THE DATABASE WITH: TYPES, FUNCTIONS, REGIONS & INDUSTRIES
// CAN BE COMMENTED OUT AFTER BEING RUN ONCE
module.exports.createData = function(req, res) {
    var typeArr = [{ name : "Code"}, { name : "Conference Paper"}, { name : "Dataset"}, { name : "Experiment Findings"}, { name : "Method"}, { name : "Presentation"}, { name : "Raw Data"}, { name : "Technical Report"}, { name : "Thesis"}, { name : "Working Paper"}];
    async.map( typeArr, function(type,next){
        var t = new Types({ type : type.name });
        t.save();
    });
    var funcArr = [{ name : "Business Technology"}, { name : "Corporate Finance"}, { name : "Marketing & Sales"}, { name : "Operations"}, { name : "Organization"}, { name : "Risk Management"}, { name : "Strategy"}, { name : "Sustainability"}];
    async.map( funcArr, function(func,next){
        var f = new Function({ function : func.name });
        f.save();
    });

    var industryArr = [{ name : "Advanced Industries"}, { name : "Automotive & Assembly"}, { name : "Consumer & Retail"}, { name : "Energy, Resources & Materials"}, { name : "Financial Services"}, { name : "Health Systems & Services"}, { name : "High Tech, Telecoms & Internet"}, { name : "Infrastructure"}, { name : "Pharmaceutical & Medical Products"}, { name : "Private Equity & Principal Investors"}, { name : "Public Sector"}, { name : "Private Sector"}, { name : "Social Sector"}, { name : "Travel, Transport & Logistics"}];
    async.map( industryArr, function(func,next){
        var i = new Industry({ industry : func.name });
        i.save();
    });

    var regionArr = [{ name : "Americas"}, { name : "Asia-Pacific"}, { name : "China"}, { name : "Europe"}, { name : "India"}, { name : "Middle East & Africa"}];
    async.map( regionArr, function(func,next){
        var r = new Region({ region : func.name });
        r.save();
    });
    console.log("Static data created.");
};

