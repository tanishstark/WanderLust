const { name } = require("ejs");
const Listing = require("../models/listing.js");
const mbxGeocodinng = require('@mapbox/mapbox-sdk/services/geocoding');
const accesToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocodinng({ accessToken: accesToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    if (req.query.category) {
        const category = req.query.category;
        const filteredListings = allListings.filter(listing => listing.categories === category);
        return res.render("listings/index.ejs", { allListings: filteredListings });
    }
    if (req.query.search) {
        const search = req.query.search;
        const filteredListings = allListings.filter(listing => listing.country.toLowerCase().includes(search.toLowerCase()));
        return res.render("listings/index.ejs", { allListings: filteredListings });
    }
    res.render("listings/index.ejs", { allListings });

}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}
module.exports.showListings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


module.exports.creatListing = async (req, res, next) => {

    let responce = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()



    console.log(req.body);
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;

    newListing.image = { url, filename }
    newListing.geometry = responce.body.features[0].geometry;
    let saveListing = await newListing.save();
    console.log(saveListing);

    req.flash('success', 'Successfully created a new listing!');
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found for editing');
        return res.redirect('/listings');
    }
    let currentImage = listing.image.url;
    currentImage = currentImage.replace("/upload", "/upload/w_300");
    res.render("listings/edit.ejs", { listing, currentImage });

}


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    let updatedListing = await Listing.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    console.log(updatedListing);

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;

        updatedListing.image = { url, filename };
        await updatedListing.save();
    }
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${updatedListing._id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let deleteListings = await Listing.findByIdAndDelete(id);
    console.log(deleteListings);
    req.flash('success', 'Successfully deleted a listing!');
    res.redirect("/listings");
}