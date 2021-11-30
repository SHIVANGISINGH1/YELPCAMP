const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedsHelper');

main().catch(err=>console.log(err));
async function main(){
    await mongoose.connect('mongodb://localhost:27017/Campground-data',{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
};

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await Campground.deleteMany({});
    
    for (let it = 1; it<=50; it++)
    {
        let random1000 = Math.floor(Math.random()*1000);
        const Price = Math.floor(Math.random() * 20) + 1;
        const camp = new Campground({
            author: '619d089f0fc6572536182013',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city} ,${cities[random1000].state}`,
            geometry: { "type" : "Point", "coordinates" : [ 
                cities[random1000].longitude,
                cities[random1000].latitude
             ] },
            images: [
                { 
                    "url" : "https://res.cloudinary.com/dzefv74jm/image/upload/v1638024929/YelpCamp/s8rkdoaxigaygmbetx8a.jpg",
                    "filename" : "YelpCamp/s8rkdoaxigaygmbetx8a"
                },
                {
                    "url" : "https://res.cloudinary.com/dzefv74jm/image/upload/v1638024931/YelpCamp/iml1ma3hoiqbnpawaf1p.jpg", 
                    "filename" : "YelpCamp/iml1ma3hoiqbnpawaf1p"
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut rerum, commodi iste iusto consequuntur ratione incidunt! Porro aut dolorum sit ab distinctio, ad explicabo amet vero aliquam sequi optio non!',
            price: Price
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})