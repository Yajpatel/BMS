const mongoose = require('mongoose');

let reviewschema = mongoose.Schema({
    
    comment : String,
    rating : {
        type : String,
        min : 1,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
})

let Review = mongoose.model('Review',reviewschema);

module.exports = {Review}