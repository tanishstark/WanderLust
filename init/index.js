const mongoose = require("mongoose");
const Listing = require("../models/listing.js")
const sampleListings = require("./data.js");



const connectDb = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}
connectDb().then(() => {
    console.log("Express is connected with  moongoose Database")
}).catch((err) => {
    console.log(err);
})

const main = async () => {
    await Listing.deleteMany({});
    sampleListings.data = sampleListings.data.map((obj) => ({
        ...obj, owner: '68931ac81b8286daed907a97'
    }))
    await Listing.insertMany(sampleListings.data)
    console.log("Data is inerted successfully");
}


main();
