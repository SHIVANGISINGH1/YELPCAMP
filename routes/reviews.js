const express = require('express');
const routes = express.Router({mergeParams: true});
const {newReview, deleteReview} = require('../Controllers/reviews')
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const {validationError2, islogedIn, isReviewAuthor} = require('../middleware');



// making reviews review->campground(one to many relationship)
routes.post('/' , validationError2, CatchAsync(newReview))

// to delete a review 
// we even need to delete it from the reviews array for the same campground
routes.delete('/:reviewid' ,islogedIn, isReviewAuthor ,CatchAsync(deleteReview))

module.exports = routes;