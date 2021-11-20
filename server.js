// Modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');

// Import User Routes
const userRoute = require('./Routes/users');
const postRoute = require('./Routes/post');
const authRoute = require('./Routes/auth');

// Env variables Config
dotenv.config();
const PORT = 5000;

// Database connection
mongoose.connect(process.env.MONGODB_CONNECT, {useNewUrlParser: true}, function() {
    console.log("Database connection established successfully")
});

// Middleware
app.use(express.json());
app.use(morgan("common"));
app.use(helmet());

// Routes
app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)


app.listen(PORT, function() {
    console.log(`Server is running! Listening on port ${PORT}`)
})