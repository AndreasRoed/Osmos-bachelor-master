var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MatchSchema = new Schema({
    researchID: {
        type: Schema.ObjectId,
        ref: 'research'
    },
    projectID: {
        type: Schema.ObjectId,
        ref: 'project'
    },
    matchingPercent: {
        type: Number,
        required: true
    },
    matchedAt: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    collaboratedAt: {
        type: Date
    },
    collaboration: {
        type: Boolean,
        required: true,
        default: false
    },
    matchedTags: [{
        _id : {
            type: Schema.ObjectId,
            ref: 'tags'
        },
        name: String
    }]
});

mongoose.model('match', MatchSchema);