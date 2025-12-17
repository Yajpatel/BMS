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
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

let count = 0;
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((i) => {
        return { ...i, owner: '681a555eb703be32f8f037bb' };
    });
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    const count = await Listing.countDocuments();
        // console.log("Total listings in DB:", count);

    console.log("Total listings in DB:", count); // <--- THIS MUST SAY 30 (or similar)
};

initDB();

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// // 1. HARDCODE the URL to match app.js exactly
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderland";

// main()
//   .then(() => {
//     console.log("Connected to DB");
//     return initDB();
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   // 2. Clear data
//   await Listing.deleteMany({});
//   console.log("Old data deleted");

//   // 3. Prepare data
//   initData.data = initData.data.map((i) => ({
//     ...i,
//     owner: "681a555eb703be32f8f037bb",
//   }));

//   // 4. Insert data
//   await Listing.insertMany(initData.data);
//   console.log("New data inserted");

//   // 5. VERIFY the data is there
//   const count = await Listing.countDocuments();
//   console.log("Total listings in DB:", count); // <--- THIS MUST SAY 30 (or similar)
// };