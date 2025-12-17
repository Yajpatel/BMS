const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../.env") });

const MONGO_URL = process.env.MONGO_URL;

console.log(MONGO_URL);
main()
    .then(() => {
        console.log("connected to DB");
        return initDB();
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((i) => {
        return { ...i, owner: '681a555eb703be32f8f037bb' };
    });
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

// initDB();