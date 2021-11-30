const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const {groundSchema,reviewSchema} = require('./schema');
const Review = require('./models/review');
module.exports.islogedIn = (req,res,next) => {
    // console.log("User is>>>", req.user);
    // req.session.goto = req.originalUrl;
    // console.log("middlewwware:::", req.session.goto)
    console.log(req.originalUrl, "middlewareeeeeeeeeeeeeee")
    req.session.returnTo = req.originalUrl;
    if(!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

// server side validations
module.exports.validationError1 = (req,res,next) => {    
    const {error} = groundSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400);
    }
    else {
        next();
    } 
}

module.exports.validationError2 = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400);
    }
    else {
        next();
    } 
}


// to check if you are the owner or not
module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)){
        req.flash('error', 'You dont own the campground');
        return res.redirect(`/campgrounds${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const {reviewid, id} = req.params;
    const review = await Review.findById(reviewid);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You dont own the review');
        return res.redirect(`/campgrounds${id}`);
    }
    next();
}