const express = require('express');
const router = express.Router({mergeParams : true});
const wrapasync = require('../utils/wrapasync');
const Listing = require("../models/listing");
const {Review} = require('../models/review');
const ExpressError = require('../utils/MyExpressError');
const {reviewschema } = require('../schemavalidation');

// Validate review middleware
let validatereview = (req, res, next) => {
    let { error } = reviewschema.validate(req.body);
    if (error) {
        next(new ExpressError(404, error.message));
    } else {
        next();
    }
};


// POST review
router.post('/', validatereview, wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let reviews = new Review(req.body.review);
    await reviews.save();
    listing.reviews.push(reviews);
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}));

// DELETE review
router.delete('/:reviewid', wrapasync(async (req, res) => {
    await Review.findByIdAndDelete(req.params.reviewid);
    await Listing.findByIdAndUpdate(req.params.listingid, {
        $pull: { reviews: req.params.reviewid }
    });
    res.redirect(`/listing/${req.params.listingid}`);
}));

module.exports = router;