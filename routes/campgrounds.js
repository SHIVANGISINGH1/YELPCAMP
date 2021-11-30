const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const CatchAsync = require('../utils/CatchAsync');
const {index, newCamp, addNewCamp, seeCamp, editCamp, updateCamp, deleteCamp} = require('../Controllers/campgrounds');
const {groundSchema} = require('../schema');
const passport = require('passport');
const {islogedIn, validationError1, isAuthor} = require('../middleware');
const {storage} = require('../cloudinary')
const multer  = require('multer');
const upload = multer({ storage: storage });

// to display campgrounds and to add new campground
router.route('/')
    .get(CatchAsync (index))
    .post(islogedIn, upload.array('image'), validationError1, CatchAsync(addNewCamp))


// to make new campground
router.get('/new', islogedIn, newCamp)

// to see a campground and to make changes & to delete the campground
router.route('/:id')
    .get(islogedIn, CatchAsync(seeCamp))
    .put(islogedIn,isAuthor , upload.array('image'), validationError1, CatchAsync(updateCamp))
    .delete(islogedIn, isAuthor ,CatchAsync(deleteCamp))

// to edit the campground
router.get('/:id/edit', islogedIn, isAuthor , CatchAsync (editCamp))


module.exports = router;