const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie.model.js");
const Celebrity = require("../models/Celebrity.model.js");

router.get("/create", async (req, res, next) => {
  const allCelebrities = await Celebrity.find().select({ name: 1 });
  res.render("movies/new-movie.hbs", { allCelebrities });
});

router.post("/create", async (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  try {
    await Movie.create({ title, genre, plot, cast });
    res.redirect("/movies");
  } catch (error) {
    res.redirect("/movies/create");
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allMovies = await Movie.find().populate("cast");

    res.render("movies/movies.hbs", { allMovies });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const oneMovie = await Movie.findById(req.params.id).populate("cast");
    //   console.log(oneMovie)
    res.render("movies/movie-details.hbs", { oneMovie });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id)
    res.redirect("/movies");
  } catch (error) {
    next(error);
  }
});

router.get("/:id/update", async (req, res, next) => {


  try {

    const responseMovieId = await Movie.findById(req.params.id)
    const allCelebrities = await Celebrity.find().select({ name: 1 })
    const cloneAllCelebrities = JSON.parse(JSON.stringify(allCelebrities))

    console.log("TEST: " + responseMovieId.cast.length)
    // if (responseMovieId.cast.length === 1) {

    //   cloneAllCelebrities.forEach((eachCelebrity) => {
    //     if (responseMovieId.cast.toString() === eachCelebrity._id.toString()) {
    //       //  console.log("el seleccionado es:", eachCelebrity)

    //       eachCelebrity.isSelected = true;
    //     }
    //   })
    // } else {
      cloneAllCelebrities.forEach((eachCelebrity) => {
        responseMovieId.cast.forEach((eachCast) => {
          if (eachCast.toString() === eachCelebrity._id.toString()) {
            //  console.log("el seleccionado es:", eachCelebrity)
            eachCelebrity.isSelected = true;
          }
        })
      })
    // }



    console.log(cloneAllCelebrities)

    res.render("movies/edit-movie.hbs", {
      oneMovie: responseMovieId,
      allCelebrities: cloneAllCelebrities
    })
  }

  catch (error) {
    next(error);
  }
});

router.post("/:id/update", (req, res, next) => {

  const movieId = req.params.id;
  const { title, genre, plot, cast } = req.body

  Movie.findByIdAndUpdate(movieId, {
    title,
    genre,
    plot,
    cast
  })
    .then(() => {
      res.redirect("/movies")
    })
    .catch((error) => {
      next(error)
    })

})

module.exports = router;
