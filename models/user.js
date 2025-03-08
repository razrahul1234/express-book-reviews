const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        trim:true
    },
    lastName : {
        type: String,
        required: true,
        trim:true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /.+\@.+\..+/

    },
    createdAt : {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    },
    roles : {
        type: [String],
        enum : ['user', 'admin', 'superadmin'],
        default : ['user']
    },
    hashedPassword: {
        type: String,
        required: true,
        trim:true,
        minlength:6,
        maxlength:200
    }
})

const  model = mongoose.model('users', userSchema);
module.exports = model;