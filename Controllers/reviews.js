const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.newReview = async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.Review);
    newReview.author = req.user; 
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Succefully added a review thanks!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async(req,res) => {
    const {id,reviewid} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews:reviewid } }); // pull will delete reviews which have id equal to reviews id
    await Review.findByIdAndDelete(reviewid);
    req.flash('success','Successfully deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}