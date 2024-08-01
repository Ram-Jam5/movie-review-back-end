/// to delete
/*
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    userReviews: { // key: reviewId, value: movieId
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: new Map(),
    },
    userComments: { // key: commentId, value: reviewId
        type: Map,
        of: mongoose.Schema.Types.ObjectId,
        default: new Map(),
    },
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model('User', userSchema);
*/