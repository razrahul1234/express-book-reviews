const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    isbn : {
        type: String,
        required:true,
        trim:true,
        unique: true
    },
    author : {
        type: String,
        required: true,
        trim:true
    },
    title : {
        type: String,
        required: true,
        trim:true

    },
    published : {
        type: Date,
        required: true,
        trim: true,
    },
    added : {
        type: Date,
        default:Date.now,
        required: true,
        trim: true
    }
})

const  model = mongoose.model('books', bookSchema);
module.exports = model;