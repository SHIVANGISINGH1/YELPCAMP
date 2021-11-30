const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const User = require('./user');

const imagesSchema = new Schema(
    {
        url: String,
        filename: String
    }
)

imagesSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100,h_100')
})

const opts = {toJSON:{virtuals: true} };
const campgroundSchema = new Schema({
    title:String,
    price:Number,
    images:[imagesSchema],
    description:String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location:String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts)

campgroundSchema.virtual('properties.popMarkup').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
})

campgroundSchema.post('findOneAndDelete', async function(data) {
    await Review.remove({
        _id: {
            $in: data.reviews
        }
    })
})

const Campground = mongoose.model('Campground',campgroundSchema);
module.exports = Campground;