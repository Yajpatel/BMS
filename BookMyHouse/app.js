const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const methodOverride = require('method-override');
app.use(methodOverride("_method"));
const mongoose = require('mongoose');
const Listing = require("./models/listing");
const { default: chalk } = require('chalk');
const { kStringMaxLength } = require('buffer');
engine = require('ejs-mate')


main()
    .then((result) => {
        console.log("successfully connected");
    })
    .catch((err) => {
        console.log("error", err);
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderland");
}
// app.use(methodOverride)
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', engine);
let port = 5000;
app.listen(port, () => {
    console.log("listening...");
});

app.get("/", (req, res) => {
    console.log("okkkkkk");
    res.send("Yaj");
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.get("/listing",async (req,res)=>{
    try {
        let listings = await Listing.find({}); // Fetch all listings from the database
        console.log(chalk.green(listings)); // Log the fetched data
        res.render('listing/index.ejs', { listings }); // Pass the listings to the template
    } catch (error) {
        console.error(chalk.red("Error fetching listings:", error));
        res.status(500).send("Internal Server Error");
    }
});
// create new
app.get("/listing/new",(req,res)=>{
    res.render('listing/new.ejs');
});
//show
app.get("/listing/:id",async (req,res)=>{
    try {
        let {id} = req.params;
        let listings = await Listing.findById(id) 
        res.render('listing/show.ejs', { listings });
    } catch (error) {
        console.error(chalk.red("Error fetching listings:", error));
        res.status(500).send("Internal Server Error");
    }
});
// create
app.post("/listings",async(req,res)=>{
    let {title,description,image,price,location,country} = req.body;
    let newlisting = new Listing(
        {title,description,image,price,location,country}
    );
    // Listing.insertOne(newlisting);
    await newlisting.save(); 
    
    console.log("new insereted successfully");
    res.redirect("/listing");
});

// edit and update
app.get("/listing/:id/edit",async(req,res)=>{
    try {
        let {id} = req.params;
        let listings = await Listing.findById(id) 
        res.render('listing/edit.ejs', { listings });
    } catch (error) {
        console.error(chalk.red("Error fetching listings:", error));
        res.status(500).send("Internal Server Error");
    }
});

app.put("/listing/:id",async(req,res)=>{
    try {
        let {id} = req.params;
        let {title,description,price,location,country} = req.body;
        // let listings = await Listing.findById(id);
        // listings.title = title;
        // listings.description = description;
        // listings.price = price;
        // listings.location = location;
        // listings.country = country;

        await Listing.findByIdAndUpdate(id,{
            title : title,
            description : description,
            price : price,
            location : location,
            country : country
        });

        console.log("update successfull");
        res.redirect(`/listing/${id}`);
    } catch (error) {
        console.error(chalk.red("Error fetching listings:", error));
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("deleted succesfully");
    res.redirect("/listing");
});

