const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: { type: String, lowercase: true },
        mail: { type: String, lowercase: true },
        name: { type: String },
        firstname: { type: String },
        lastname: { type: String },
        title: { type: String },
        displayname: { type: String }
    }
);

module.exports = mongoose.model('User', UserSchema);
