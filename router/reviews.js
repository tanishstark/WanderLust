const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js")
const { isLoggedIn, validateReviews, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//Review Sectiion
//Post route


router.post("/", isLoggedIn, validateReviews, wrapAsync(reviewController.createReview))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;