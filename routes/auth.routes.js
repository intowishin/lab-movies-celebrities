const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const User = require("../models/User.model");

router.get("/create-account", (req, res, next) => {
    res.render("auth-pages/signup");
});

router.post("/create-account", (req, res, next) => {
    const saltRounds = 10;
    const {username, email, password} = req.body;

    bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username,
            email,
            passwordHash: hashedPassword
        })
    })
    .then(newUser => {
        res.redirect("/profile")
    })
    .catch(err => console.log(err))
})

router.get("/profile", (req, res, next) => {
    res.render("user-pages/profile-page")
})

module.exports = router;