const router = require("express").Router();

const { isLoggedIn } = require("../config/route-guard.config");

router.get("/secret", isLoggedIn, (req, res, next) => {
    res.render("secret.hbs");
})

module.exports = router;