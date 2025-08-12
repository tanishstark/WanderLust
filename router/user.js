const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));


router.route("/login")
    .get(userController.renderLoginUpForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login)

router.get("/logout", userController.logout);

module.exports = router;