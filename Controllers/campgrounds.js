const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')
const mbxGeocoding =  require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.map_token;
const geocoder = mbxGeocoding({
    accessToken: maptoken
})

module.exports.index = async(req,res,next) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index',{camp});
}

module.exports.newCamp = (req,res) => {
    res.render('campgrounds/new');
}

module.exports.addNewCamp = async (req,res,next) => {
    const data = await geocoder.forwardGeocode({
        query: req.body.Campground.location,
        limit: 1
    }).send();
    const newCamp = req.body.Campground;
    const camp = new Campground(newCamp);
    camp.author = req.user;
    camp.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    camp.geometry = data.body.features[0].geometry;
    await camp.save();
    console.log(camp);
    req.flash('success' , 'Succefully created a new campground')
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.seeCamp = async(req,res,next) => {
    
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground does not exist!!!!!!!!');
        res.redirect('/campgrounds')
    }
    let co = camp.geometry.coordinates;
    res.render('campgrounds/show',{camp,co});
}

module.exports.editCamp = async (req,res,next) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        req.flash('error', 'Campground does not exist!!!!!!!!');
        return res.redirect('/campgrounds')
    }
    
    res.render('campgrounds/edit', {camp});
}

module.exports.updateCamp = async (req,res,next) => {
    const {id} = req.params;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.Campground});
    const array = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    camp.images.push(...array);
    let delImages = req.body.deleteImages;
    if (delImages) {

        for (let filename of delImages) {
            // deleteing images form cloudinary 
            await cloudinary.uploader.destroy(filename);
        }


        // delete those selected Images from the campground images array which are in delete Images array 
        await camp.updateOne({$pull :{images: {filename: { $in: delImages} } } });
    }
    await camp.save();
    req.flash('success', 'Successfully updated the campground!!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCamp = async(req,res,next) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!!!!');
    res.redirect('/campgrounds');
}