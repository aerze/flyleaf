'use strict';
/* jshint node:true */
var express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    stylus      = require('stylus');

var app = new express();

app.use(stylus.middleware({
    src: path.join(__dirname, '/stylus'),
    dest: path.join(__dirname, '/app'),
    compile: function (string, path) {
        return stylus(string)
        .set('filename', path)
        .set('compress', true);
    }
}));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname + '/app')));
app.use('/docs', express.static(path.join(__dirname + '/docs/flyleaf/0.1.0')));
app.use('/material', express.static(path.join(__dirname + '/node_modules/materialize-css')));

var port = process.env.PORT || 80;
console.log(port);
app.listen(port, function() {
    console.log('Server started');
});