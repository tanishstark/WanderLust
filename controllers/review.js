const Review = require("../models/reviews.js")
const Listing = require("../models/listing.js")

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newrReview = new Review(req.body.review)
    newrReview.author = req.user._id;
    listing.reviews.push(newrReview._id);


    await newrReview.save();
    await listing.save();
    // console.log(newrReview)
    req.flash('success', 'Successfully created a new review!');
    console.log("Review Save");
    res.redirect(`/listings/${listing.id}`);


}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!');
    res.redirect(`/listings/${id}`);
}