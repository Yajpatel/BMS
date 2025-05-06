const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync');
const ExpressError = require('../utils/MyExpressError');
const Listing = require("../models/listing");
let { listingschema } = require('../schemavalidation');
const islogin = require('../middleware');
// Middleware for validating listings
const validationlisting = (req, res, next) => {
    console.log(req.body.listing);
    let result = listingschema.validate(req.body);
    console.log(result);

    if (result.error) {
        next(new ExpressError(404, result.error));
    } else {
        next();
    }
};

// INDEX - show all listings
router.get("/", async (req, res) => {
    let listings = await Listing.find({});
    res.render('listing/index.ejs', { listings });
});

// create get
router.get("/new", islogin, (req, res) => {
    console.log(req.user)
        res.render('listing/new.ejs');
});
// CREATE POST - create new listing
router.post("/", validationlisting, wrapasync(async (req, res) => {
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();

    req.flash('created','new listing created');
    // req.flash('failed','failed to create listing');

    console.log("new inserted successfully");
    res.redirect("/listing");
}));

// SHOW - show single listing
router.get("/:id", wrapasync(async (req, res, next) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate('reviews');
    if (!listings){
        req.flash('failed','id deleted that u are finding or not found');
       res.redirect('/listing');
    }
    else{
        res.render('listing/show.ejs', { listings });
    }
    //  return next(new ExpressError(404, "Listing not found"));
}));


// EDIT - show edit form
router.get("/:id/edit", islogin,wrapasync(async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    res.render('listing/edit.ejs', { listings });
}));

// UPDATE - update listing
router.put("/:id", validationlisting, wrapasync(async (req, res) => {
    let { id } = req.params;
    let { title, description, price, location, country } = req.body.listing;

    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        price,
        location,
        country
    });

    req.flash('created','listing updated');
    console.log("update successful");
    res.redirect("/listing");
}));

// DELETE - delete listing
router.delete("/:id",islogin, wrapasync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('created','listing deleted');
    console.log("deleted successfully");
    res.redirect("/listing");
}));

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const wrapasync = require('../utils/wrapasync');
// const ExpressError = require('../utils/MyExpressError');
// const Listing = require("../models/listing");
// let {listingschema,reviewschema} = require('../schemavalidation');

// const validationlisting = (req,res,next)=>{
//     console.log(req.body.listing);

//     // if(!req.body){
//     //     next(new ExpressError(400,"galti"))
//     // }

//     let result = listingschema.validate(req.body);
//     console.log(result);

//     if(result.error){
//         next(new ExpressError(404,result.error));  
//     }
//     else{
//         next();
//     }
// }

// router.get("/",async (req,res)=>{
//     try {
//         let listings = await Listing.find({}); // Fetch all listings from the database
//         // console.log(chalk.green(listings)); // Log the fetched data
//         res.render('listing/index.ejs', { listings }); // Pass the listings to the template
//     } catch (error) {
//         console.error(chalk.red("Error fetching listings:", error));
//         res.status(500).send("Internal Server Error");
//     }
// });
// // create new
// router.get("/new",(req,res)=>{
//     res.render('listing/new.ejs');
// });
// //show
// router.get("/:id",wrapasync(
//     async (req,res,next)=>{
//         // try {
//             let { id } = req.params;
//             let listings = await Listing.findById(id).populate('reviews');
//             console.log(listings);
//             if (!listings) {
//                 return next(new ExpressError(404, "Listing not found"));
//             }
//             res.render('listing/show.ejs', { listings });
//         // } catch (error) {
//             // console.error(chalk.red("Error fetching listings:", error));
//             // res.status(500).send("Internal Server Error");
//         // }
//     }
// ));


// // create
// router.post("/", validationlisting,wrapasync (async(req,res,next)=>{
//     let newlisting = new Listing(req.body.listing);
//     await newlisting.save();
//     console.log("new insereted successfully");

//     // let {title,description,image,price,location,country} = req.body;
//     // let newlisting = new Listing(
//         //     {title,description,image,price,location,country}
//         // );
//         // Listing.insertOne(newlisting);
//         // try {
//         //     let newlisting = new Listing(req.body);
//         //     await newlisting.save();
//         //     console.log("new insereted successfully");
//         // } catch (error) {
//         //     console.log(error);
//         //     next(err);
//         // }
        
    
//     res.redirect("/listing");
//         }
//     )
// );

// // edit and update
// router.get("/:id/edit",wrapasync(async(req,res)=>{
//     try {
//         let {id} = req.params;
//         let listings = await Listing.findById(id) 
//         res.render('listing/edit.ejs', { listings });
//     } catch (error) {
//         console.error(chalk.red("Error fetching listings:", error));
//         res.status(500).send("Internal Server Error");
//     }
// }));

// router.put("/:id",validationlisting,wrapasync(async(req,res)=>{
//     try {
//         let {id} = req.params;

        

//         let {title,description,price,location,country} = req.body.listing;
//         // let listings = await Listing.findById(id);
//         // listings.title = title;
//         // listings.description = description;
//         // listings.price = price;
//         // listings.location = location;
//         // listings.country = country;

//         await Listing.findByIdAndUpdate(id,{
//             title : title,
//             description : description,
//             price : price,
//             location : location,
//             country : country
//         });

//         console.log("update successfull");
//         res.redirect(`/listing`);
//     } catch (error) {
//         console.error(chalk.red("Error fetching listings:", error));
//         res.status(500).send("Internal Server Error");
//     }
// }
// ));


// // listingschema.post("findOneAndDelete",async(data)=>{
// //     if(data){
// //         await Review.deleteMany({_id : {$in : data.reviews}});
// //     }
// // });

// //delete
// // router.delete("/:id",wrapasync(async(req,res)=>{
// //     let {id} = req.params;
// //     await Listing.findByIdAndDelete(id);
// //     console.log("deleted succesfully");
// //     res.redirect("/listing");
// // }
// // ));

// module.exports = router;