var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    createdBy: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    partners: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{
        _id : {
            type: Schema.ObjectId,
            ref: 'tags'
        },
        name: String
    }],
    industry: {
        type: Schema.ObjectId,
        ref: 'industries'
    },
    end_date: {
        type: Date
    },
    function: {
        type: Schema.ObjectId,
        ref: 'functions'
    },
    region: {
        type: Schema.ObjectId,
        ref: 'regions'
    },
    imageURL: {
        type: String,
        default: 'images/default_project.png'}
});

mongoose.model('project', ProjectSchema);