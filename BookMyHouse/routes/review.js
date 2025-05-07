const express = require('express');
const router = express.Router({mergeParams : true});
const wrapasync = require('../utils/wrapasync');
const Listing = require("../models/listing");
const {Review} = require('../models/review');
const ExpressError = require('../utils/MyExpressError');
const {reviewschema } = require('../schemavalidation');
const { validatereview, isLoggedin, isAuthorofreview } = require('../middleware');

// Validate review middleware


// POST review
router.post('/', isLoggedin,validatereview, wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let reviews = new Review(req.body.review);
    reviews.author = req.user._id;
    await reviews.save();
    listing.reviews.push(reviews);
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
}));

// DELETE review
router.delete('/:reviewid', isLoggedin,isAuthorofreview,wrapasync(async (req, res) => {
    const { id, reviewid } = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewid }
    });
        res.redirect(`/listing/${id}`);
    }));

module.exports = router;