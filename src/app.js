"use strict";
const express = require('express');
const app = express();
const route = require('./route/router');
const ErrorHandling = require('./middleware/errorHnadler');
const cookieparser = require('cookie-parser');

app.use(require('cors')());
app.use(require('helmet')());
app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());



app.use('/api',route);
app.use(ErrorHandling);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running"
    });
});


module.exports = app;