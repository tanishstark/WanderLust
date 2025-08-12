if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listingsRouter = require("./router/listings.js");
const reviewsRouter = require("./router/reviews.js");
const userRouter = require("./router/user.js");
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");





const connectDb = async () => {
    await mongoose.connect(process.env.ATLASDB_URL)
}
connectDb().then(() => {
    console.log("Express is connected with  moongoose Database")
}).catch((err) => {
    console.log(err);
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);



const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", (error) => {
    console.log("Session Store Error", error);
});

const sessionOpton = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
        httpOnly: true
    }
};



app.use(session(sessionOpton));
app.use(flash()); // Middleware to use flash messages



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.redirect("/listings");
});


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "tanish@in.com",
//         username: "Mohitlal mahto"
//     })


//     let registerUser = await User.register(fakeUser, "helloworld");
//     res.send(registerUser)
// })



/* ===============<>===================== */




app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);





/* ===============<>===================== */

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
});


app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("Server is listening to port number 8080")
})