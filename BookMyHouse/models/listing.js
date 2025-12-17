const mongoose = require("mongoose");
const { Review } = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String    
    },
    price: Number,
    location: String,
    country: String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review" // this should be same as 
                                            // this
                                            // ||
            // let Review = mongoose.model('Review',reviewschema);
        }
    ],
    owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
    }
});
listingSchema.post("findOneAndDelete",async(data)=>{
    if(data){
        await Review.deleteMany({_id : {$in : data.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;