// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie = require("../models/Movie.model");

// all your routes here

// Show the form to create a movie
router.get("/movies/create", (req, res, next) => {
  Celebrity.find()
    .then((allCast) => {
      res.render("movies/new-movie", { allCast });
    })
    .catch((err) => console.log(err));
});

// Post the data to create a movie
router.post("/movies/create", (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })
    .then((newMovie) => {
      res.redirect("/movies");
    })
    .catch((err) => {
      console.log(err);
      res.render("movies/new-movie");
    });
});

router.get("/movies", (req, res, next) => {
  Movie.find()
    .then((allMovies) => {
      res.render("movies/movies.hbs", { allMovies });
    })
    .catch((err) => console.log(err));
});

router.get("/movies/:id", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((movieDetails) => {
      res.render("movies/movie-details", movieDetails);
    })
    .catch((err) => console.log(err));
});

router.post("/movies/:id/delete", (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(() => res.redirect("/movies"))
    .catch((err) => console.log(err));
});

router.get("/movies/:id/edit", (req, res, next) => {
  Movie.findById(req.params.id)
    .populate("cast")
    .then((editMovie) => {
      Celebrity.find()
        .then((allCelebrities) => {
          const allOtherCelebrities = allCelebrities.filter(
            (oneCelebrity) => !oneCelebrity._id.equals(editMovie.cast._id)
          );
          res.render("movies/edit-movie", { editMovie, allOtherCelebrities });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.post("/movies/:id/update", (req, res, next) => {
  const { title, genre, plot } = req.body;
  Movie.findByIdAndUpdate(
    req,
    params,
    id,
    { title, genre, plot },
    { new: true }
  )
    .then((updatedMovie) => res.redirect(`/movies/${updatedMovie_id}`))
    .catch((err) => console.log(err));
});

module.exports = router;
