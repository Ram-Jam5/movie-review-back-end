const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true
          },
          author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comments: [commentSchema]
    },
    { timestamps:true }
);


const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        director: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Musical', 'Romance', 'Science-Fiction', 'Thriller', 'Western' ],
        },
        year: {
            type: Number, // changed from year to Number
            required: true,
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviews: [reviewSchema],
        },
        { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;