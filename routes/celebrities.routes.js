// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");

// all your routes here

router.get("/celebrities/create", (req, res, next) => {
  res.render("celebrities/new-celebrity");
});

router.post("/celebrities/create", (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  Celebrity.create({ name, occupation, catchPhrase })
    .then((newCelebrity) => {
      res.redirect("/celebrities");
    })
    .catch((err) => {
      console.log(err);
      res.render("celebrities/new-celebrity");
    });
});

router.get("/celebrities", (req, res, next) => {
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("celebrities/celebrities.hbs", { allCelebrities });
    })
    .catch((err) => console.log(err));
});

module.exports = router;