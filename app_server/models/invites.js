var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InviteSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    invitedAt: Date
});

mongoose.model('invite', InviteSchema);