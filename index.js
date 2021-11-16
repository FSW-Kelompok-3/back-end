// import express
const express = require('express');
const app = express();

//import dotenv
const dotenv = require('dotenv').config();

// get port from env, if env not set, use 3000
const port = process.env.port || 4000;

// use middleware for request parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// import passport
const passport = require('./lib/passport');
// use passport for jwt auth
app.use(passport.initialize());


// import routes
const router = require('./routes');




// use route
app.use(router);

// run app in port specified
app.listen(port, () => {
    console.log(`App is running in http://localhost:${port}`);
});