const express = require('express');
const wrapasync = require('../utils/wrapasync');
const User = require('../models/user');
const router = express.Router();
const passport = require('passport');
const { savedUrl } = require('../middleware');

router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
});

router.post('/signup',wrapasync(async(req,res)=>{ 
    let {username,email,password} = req.body;
    let user = new User({
        email : email,
        username : username
    })
    try {
        let registered = await User.register(user,password);
        console.log(registered);
        req.login(registered,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('created','login successfully');
            res.redirect('/listing');
        });
    } catch (e) {
        req.flash('failed','user  already exist');
        res.redirect('/signup');
    }
}));

router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
});

router.post('/login',savedUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash : true}),(req,res)=>{
    req.flash('created','welcome back admin!!');
    res.redirect(res.locals.url || '/listing');
});

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('created','you loggged out');
        res.redirect('/listing');
    })
});

module.exports = router;