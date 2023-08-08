const express = require('express');
const router = express.Router();

const Celebrity = require("../models/Celebrity.model.js")

// const router = require("express").Router();

router.get("/create", (req, res, next) => {
    res.render("celebrities/new-celebrity.hbs")
})

router.post("/create", async (req, res, next) => {
    console.log(req.body)
    const { name, occupation, catchPhrase } = req.body
    try {
        await Celebrity.create({ name, occupation, catchPhrase })
        res.redirect("/celebrities")
    }
    catch (error) {
        res.redirect("/celebrities/create")
        next(error)
    }
})

router.get("/", async(req, res, next) => {
    try {
      const allCelebrities = await Celebrity.find()
      
      res.render("celebrities/celebrities.hbs",{allCelebrities})



    } 
    catch (error) { next(error) }
    
    
    
    
    
    
    
})




module.exports = router;