require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const chalk = require('chalk');
console.log("hi",process.env.MONGO_URL);
// const { listingschema, reviewschema } = require('./schemavalidation');
const listingrouter = require('./routes/listing.js');
const reviewrouter = require('./routes/review.js');
const userRouter = require('./routes/user.js')
const ExpressError = require('./utils/MyExpressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const session = require('express-session');
app.use(session({
    secret : process.env.SECRET,
    resave : false , 
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 24*60*60,
        maxAge : 24*60*60,
        httpOnly : true
    }
}))

const flash = require('connect-flash');

//this should be below session
app.use(passport.initialize());
app.use(passport.session()); //It allows the user to stay authenticated between requests without needing to re-enter their credentials every time.
passport.use(new LocalStrategy(User.authenticate())); // passport.use() is how we define which strategy Passport will use to authenticate users.Here, we are using LocalStrategy, which is for username and password authentication (this is the "local" strategy).
//User.authenticate is a helper method provided by the passport-local-mongoose plugin. It checks if the username/password match in the database.If they do, it returns the user object.If not, it will trigger a failure callback.
passport.serializeUser(User.serializeUser()); // When the user logs in successfully, Passport saves just the user's ID (not the whole user data) into the session.
passport.deserializeUser(User.deserializeUser()); // Every time a request comes in (after the user has logged in), Passport looks at the user ID stored in the session and fetches the user's full details from the database. 



// app.get('/demouser',async(req,res)=>{
//     let user = new User({
//         email : 'abc@gmail.com',
//         username : 'abc'
//     })
//     // await user.save();
//     let registered = await User.register(user,'password');
//     res.send(registered);
// })
// Connect to MongoDB
main().then(() => console.log("MongoDB connected")).catch(err => console.log("Mongo error", err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

// Set up EJS and middleware
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', engine);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));    

app.use(flash());
//req.locals
app.use((req,res,next)=>{
    res.locals.createsuccess = req.flash('created');
    res.locals.createfail = req.flash('failed');
    res.locals.curruser = req.user;
    // console.log(res.locals.createsuccess);
    // console.log(res.locals.createfail);
    next();
})
// use flash before this routing
// Mount Routes
app.use('/listing', listingrouter);
app.use('/listing/:id/reviews',reviewrouter);
app.use('/',userRouter);


// Home route
app.get("/", (req, res) => {
    res.send("Wanderland Home");
});


// 404 Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// General Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render('error.ejs', { message });
});

// Listen
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});



////////////////////////////////////////////////////////////////////////////////
// const express = require('express');
// const app = express();
// const path = require('path');
// const ejs = require('ejs');
// const methodOverride = require('method-override');
// app.use(methodOverride("_method"));
// const mongoose = require('mongoose');
// const Listing = require("./models/listing");
// const { default: chalk } = require('chalk');
// const { kStringMaxLength } = require('buffer');
// const wrapasync = require('./utils/wrapasync');
// const { stat } = require('fs');
// const ExpressError = require('./utils/MyExpressError');
// const Joi = require('joi');

// let {listingschema,reviewschema} = require('./schemavalidation');
// const { Review } = require('./models/review');
// engine = require('ejs-mate')


// const listing = require('./routes/listing.js')

// main()
//     .then((result) => {
//         console.log("successfully connected");
//     })
//     .catch((err) => {
//         console.log("error", err);
//     })

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderland");
// }
// // app.use(methodOverride)
// app.set('view engine', 'ejs');
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
// app.engine('ejs', engine);
// let port = 5000;
// app.listen(port, () => {
//     console.log("listening...");
// });

// app.get("/", (req, res) => {
//     console.log("okkkkkk");
//     res.send("Yaj");
// });

// app.use('/listing',listing);

// // app.get("/testListing", async (req, res) => {
// //     let sampleListing = new Listing({
// //         title: "My New Villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Calangute, Goa",
// //         country: "India",
// //     });

// //     await sampleListing.save();
// //     console.log("sample was saved");
// //     res.send("successful testing");
// // });

// // app.use('/listing',listing);



// //     app.get("/listing",async (req,res)=>{
// //         try {
// //             let listings = await Listing.find({}); // Fetch all listings from the database
// //             // console.log(chalk.green(listings)); // Log the fetched data
// //             res.render('listing/index.ejs', { listings }); // Pass the listings to the template
// //         } catch (error) {
// //             console.error(chalk.red("Error fetching listings:", error));
// //             res.status(500).send("Internal Server Error");
// //         }
// //     });
// //     // create new
// //     app.get("/listing/new",(req,res)=>{
// //         res.render('listing/new.ejs');
// //     });
// //     //show
// //     app.get("/listing/:id",wrapasync(
// //         async (req,res,next)=>{
// //             // try {
// //                 let { id } = req.params;
// //                 let listings = await Listing.findById(id).populate('reviews');
// //                 console.log(listings);
// //                 if (!listings) {
// //                     return next(new ExpressError(404, "Listing not found"));
// //                 }
// //                 res.render('listing/show.ejs', { listings });
// //             // } catch (error) {
// //                 // console.error(chalk.red("Error fetching listings:", error));
// //                 // res.status(500).send("Internal Server Error");
// //             // }
// //         }
// //     ));


// let validatereview = (req,res,next)=>{
//     let {error} =  reviewschema.validate(req.body);
//     console.log(error);
//     if(error){
//         next(new ExpressError(404,error.message));
//     }
//     else{
//         next();
//     }
// }
// //reviews 
// app.post('/listing/:id/reviews',validatereview,wrapasync(async(req,res,next)=>{
//     // console.log(req.body);
//         let listing = await Listing.findById(req.params.id);
//         let reviews = new Review(req.body.review);
//         // console.log(reviews);

//         await reviews.save();
//         listing.reviews.push(reviews);

//         await listing.save();
        
//         res.redirect(`/listing/${listing._id}`)
//     }
// ));


// app.delete('/listing/:listingid/reviews/:reviewid',wrapasync(async(req,res,next)=>{
//     let review = await Review.findByIdAndDelete(req.params.reviewid);

//     let listing = await Listing.findByIdAndUpdate(req.params.listingid,{$pull : {reviews : req.params.reviewid}})
//     console.log(listing);
//     console.log(review);
//     res.redirect(`/listing/${req.params.listingid}`);
// }));
// // app.use("/",(req,res,next)=>{
// //     next(new ExpressError(404,"page not founddd!"));
// // })

// // app.all("*",(req,res,next)=>{
// //     console.log("hyy trigger");
// //     next(new ExpressError(404,"page not founddd!"));
// // })
// app.use((req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// app.use((err,req,res,next)=>{
//     let {status=500,message="something"} = err;
//     res.status(status).render('error.ejs',{message});
// })