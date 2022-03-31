const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User.model");

router.get("/create-account", (req, res, next) => {
    res.render("auth-pages/signup");
});

router.post("/create-account", (req, res, next) => {
    const saltRounds = 10;
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        res.render("auth-pages/signup", {
            errorMessage: "Please fill out all fields"
        });
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
        .status(400)
        .render("auth-pages/signup", {errorMessage: "Password must contain at least one number, one uppercase letter, and one lowercase letter, and at least six characters"});
        return;
    }

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
        req.session.currentUser = newUser;
        res.redirect("/profile")
    })
    .catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).render("auth-pages/signup", {errorMessage: err.message});
        } else if(err.code === 11000) {
            res.status(400).render("auth-pages/signup", {errorMessage: "Email or Username already in use"});
        } else {
            console.log("error:", err.message);
            next(err);
        }
    });
})

router.get("/login", (req, res, next) => res.render("auth-pages/login"));

router.post("/process-login", (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.render("auth-pages/login", {errorMessage: "Please fill out all fields"});
        return;
    }

    User.findOne({ email })
        .then(newUser => {
            if (!newUser) {
                return res.render("auth-pages/login", {
                    errorMessage: "Email or Password is incorrect"
                })
            } else if (bcryptjs.compareSync(password, newUser.passwordHash)) {
                req.session.currentUser = newUser;
                res.redirect("/profile");
            } else {
                res.render("auth-pages/login", {
                    errorMessage: "Email or Password is incorrect"
                })
            }
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
    });



router.get("/profile", (req, res, next) => {
    res.render("user-pages/profile-page", {userInSession: req.session.currentUser});
})

module.exports = router;