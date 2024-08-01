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
router.put('/:movieId/edit', async (req ,res) => {
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
        const movie = await Movie.findById(req.params.movieId).populate('author');
        console.log(movie)
        const reviews = movie.reviews;
        res.status(200).json(movie);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

//SHOW REVIEW
// returns a particular review based on a particular reviewId
router.get('/:movieId/:reviewId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId).populate('reviews.author', 'reviews.comments.author');
        const review = movie.reviews.id(req.params.reviewId);
        res.status(200).json(review);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
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
        const review = movie.reviews.id(req.params.reviewId)
        if (!review.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that");
        }
        console.log('before removal:', movie.reviews);
        movie.reviews.pull(req.params.reviewId);
        console.log('After removal:', movie.reviews)
        await movie.save();
        res.status(200).json({ review: review });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);    
    }
});
//Post Comment
router.post('/:movieId/:reviewId/comments/:commentId', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const movie = await Movie.findById(req.params.movieId);
        const review = movie.reviews.id(req.params.reviewId)
        console.log(review.comments)
        review.comments.push(req.body);
        console.log(review.comments)
        await movie.save();
        const newComment = review.comments[review.comments.length -1];
        newComment._doc.author = req.user;
        res.status(200).json(newComment);
    } catch (error) {
        res.status(500).json(error)
    }
})
        
// Updating a comment
router.put('/:movieId/:reviewId/comments/:commentId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        const review = movie.reviews.id(req.params.reviewId)
        const comment = review.comments.id(req.params.commentId);
        comment.text = req.body.text;
        await movie.save();
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json(error)       
    }
})

// Deleting a comment
router.delete('/:movieId/:reviewId/comments/:commentId', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        const review = movie.reviews.id(req.params.reviewId);
        const comment = review.comments.id(req.params.commentId);
        if (!comment.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        review.comments.pull(req.params.commentId);
        await movie.save();
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router // keep at bottom of file