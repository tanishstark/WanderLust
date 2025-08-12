const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { equal } = require("joi");
const { authenticate } = require("passport");
const listingsController = require("../controllers/listings.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })



router.route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedIn,
        upload.single('image'),
        validateListing,
        wrapAsync(listingsController.creatListing));



// Create Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);


// Show Route
router.route("/:id")
    .get(wrapAsync(listingsController.showListings))
    .patch(isLoggedIn,
        isOwner,
        upload.single('image'),
        wrapAsync(listingsController.updateListing))
    .delete(isLoggedIn,
        isOwner,
        wrapAsync(listingsController.deleteListing));


// Edit Listing Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm));




module.exports = router;