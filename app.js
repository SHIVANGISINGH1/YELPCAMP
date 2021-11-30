if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const methodOverride = require('method-override'); 
const ejsMate = require('ejs-mate'); // for using layout,partial template functions of ejs
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const {groundSchema,reviewSchema} = require('./schema');
const Review = require('./models/review');
const Campgroundsroute = require('./routes/campgrounds');
const reviewsroute = require('./routes/reviews');
const userroute = require('./routes/users');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStratergy = require('passport-local');
const helmet = require('helmet');
const User = require('./models/user');
const db = process.env.db_URL ||'mongodb://localhost:27017/Campground-data'
const { serializeUser, deserializeUser } = require('passport');

main().catch(err=>console.log(err));
async function main(){
    await mongoose.connect(db,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
}


app.engine('ejs',ejsMate);
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended:true})); // to send body data  
app.use(methodOverride('_method')); // to use other methods eg delete,put in the form
app.use(express.static(path.join(__dirname,'public')));
app.use(flash());
app.use(mongoSanitize());


const secret = process.env.secret ||  'writesomenicesecret'

// for authentication
app.use(session({
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
    },
    store: MongoStore.create({
            mongoUrl: db,
            touchAfter: 24 * 3600 
    })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzefv74jm/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
passport.use(new localStratergy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req,res) => {
    res.render('campgrounds/home');
})

app.use('/campgrounds',Campgroundsroute)

app.use('/campgrounds/:id/reviews' , reviewsroute);


app.use('/' , userroute);


app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',400));
})

app.use((err,req,res,next) => {
    const {statusCode=500} = err;
    if (!err.message) {
        err.message = 'Oh no something went wrong';
    }
    res.status(statusCode).render('error', {err});
})
const port = process.env.PORT || 3000;

app.listen(port,() => {
    console.log(`Listening to ${port}`);
})