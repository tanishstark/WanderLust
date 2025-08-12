const mongoose = require("mongoose");
const Review = require("./reviews.js");
const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    categories: {
        type: String,
        required: true,
    }
});


ListingSchema.post("findOneAndDelete", async (listings) => {
    if (listings) {
        await Review.deleteMany({ _id: { $in: listings.reviews } })
    }
});


const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;