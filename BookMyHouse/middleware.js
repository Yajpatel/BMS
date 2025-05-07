const Listing = require("./models/listing");
const { Review } = require("./models/review");
const {reviewschema } = require('./schemavalidation');

let isLoggedin = (req,res,next)=>{
    // console.log("req == ",req);
    // console.log(req.user);
    req.session.redirectUrl = req.originalUrl;


    // console.log(req.session.redirectUrl);
    // res.locals.saveUrl = req.session.redirectUrl;
    if(!req.isAuthenticated()){
    req.flash('failed','you need to login first');
    return res.redirect('/login');
    }
    next();
}

let savedUrl = (req,res,next)=>{
    res.locals.url = req.session.redirectUrl;
    next();
}

let isOwner = async(req,res,next)=>{
    let {id } = req.params;
    let listings =await Listing.findById(id);
    console.log(res.locals.curruser._id)
    console.log(listings.owner._id);
    if((!listings.owner._id.equals(res.locals.curruser._id))){
        req.flash('failed','you dont have access to edit or delete this');
        return res.redirect(`/listing/${id}`);
    }
    next();
}
let validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        next(new ExpressError(404, error.message));
    } else {
        next();
    }
};

let isAuthorofreview = async(req,res,next)=>{
    let {id ,reviewid} = req.params;
    let review =await Review.findById(reviewid);
    if((!review.author._id.equals(res.locals.curruser._id))){
        req.flash('failed','you dont have access to edit or delete this');
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports = {isLoggedin,savedUrl,isOwner,validatereview,isAuthorofreview};