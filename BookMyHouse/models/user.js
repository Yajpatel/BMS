const { required } = require('joi');
const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');
const userschema = mongoose.Schema({
    email : {
        type : String,
        required : true
    }
});

userschema.plugin(passportlocalmongoose);

const User = mongoose.model('User',userschema);

module.exports = User;