var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResearchSchema = new Schema({
    createdBy: {
        type: Schema.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    partners: {
        type: String
    },
    citations: {
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
    documentURLs: [{
        URL : String,
        name : String
    }],
    tags: [{
        _id : {
            type: Schema.ObjectId,
            ref: 'tags'
        },
        name: String
    }],
    type: {
        type: Schema.ObjectId,
        ref: 'types',
        required: true
    },
    imageURL: {
        type: String,
        default: 'images/default_research.png'}
});

mongoose.model('research', ResearchSchema);