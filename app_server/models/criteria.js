var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FunctionsSchema = new Schema({
    function: {
        type: String
    }
});
var IndustrySchema = new Schema({
    industry: {
        type: String
    }
});
var RegionsSchema = new Schema({
    region: {
        type: String
    }
});
var TypesSchema = new Schema({
    type: {
        type: String
    }
});
mongoose.model('functions', FunctionsSchema);
mongoose.model('industries', IndustrySchema);
mongoose.model('regions', RegionsSchema);
mongoose.model('types', TypesSchema);