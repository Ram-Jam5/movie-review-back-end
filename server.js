const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const moviesRouter = require('./controllers/movies');

mongoose.connect(process.env.MONGODB_URI);
const PORT = process.env.PORT
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());
app.get('/', (req,res) => {
    res.send('The site is functional.')
})
// Routes go here
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/movies', moviesRouter);

app.listen(PORT, () => {
    console.log('The express app is ready!');
});