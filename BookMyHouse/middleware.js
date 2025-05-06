isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
    req.flash('failed','you need to login first');
    return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedin;