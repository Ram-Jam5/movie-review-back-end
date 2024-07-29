const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Movie = require('../models/movie.js');
const router = express.Router();

// === PUBLIC ROUTES ===

// === PROTECTED ROUTES === 
router.use(verifyToken); // keep at top of PROTECTED ROUTES

// POST MOVIE, required: title, director, category, year
router.post('/', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const movie = await Movie.create(req.body); // create Movie document
        movie._doc.author = req.user;
        res.status(201).json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// GET MOVIES
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({})
            .populate('author')
            .sort({ createdAt: 'desc' });
        res.status(200).json(movies);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// PUT MOVIE
router.put('/:movieId', async (req ,res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that");
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.movieId,
            req.body,
            { new: true }
        );

        updatedMovie._doc.author = req.user;
        res.status(200).json(updatedMovie);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
})

// DELETE MOVIE
router.delete('/:movieId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that");
        }

        const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);
        res.status(200).json(deletedMovie);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);      
    }
})

// POST REVIEW, required: title, text
router.post('/:movieId', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const movie = await Movie.findById(req.params.movieId); // find Movie
        movie.reviews.push(req.body);
        await movie.save();
        const newReview = movie.reviews[movie.reviews.length - 1];
        newReview._doc.author = req.user;
        res.status(201).json(newReview);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// GET REVIEW
// returns all reviews under a movie
router.get('/:movieId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId).populate('reviews.author');
        const reviews = movie.reviews;
        res.status(200).json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// PUT REVIEW
router.put('/:movieId/:reviewId', async (req ,res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        const review = movie.reviews.id(req.params.reviewId);

        if (!review.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that");
        }

        review.set(req.body);

        await movie.save();
        res.status(200).json(review);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
})

// DELETE REVIEW, UNDER CONSTRUCTION
router.delete('/:movieId/:reviewId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        const review = movie.reviews.id(req.params.reviewId);

        if (!review.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that");
        }

        review.remove();

        await movie.save();
        res.status(200).json({ message: "Review deleted successfully! "});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
})

module.exports = router // keep at bottom of file