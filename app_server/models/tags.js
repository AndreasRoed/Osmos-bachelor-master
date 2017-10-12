var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagsSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    timesUsed: {
        type: Number,
        default: 1
    }
});

mongoose.model('tags', TagsSchema);