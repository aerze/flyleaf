'use strict';

var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan');

var app = new express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname + '/app')));

app.listen(80, function() {
    console.log('Server started');
});