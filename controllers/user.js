const User = require("../models/users.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password)
        console.log(registerUser);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (error) {
        console.log(error);
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginUpForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = (req, res) => {
    req.flash("success", "Logged in successfully!");
    res.redirect(res.locals.redirectUrl || "/listings"); // Redirect to original URL or default
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });
}
