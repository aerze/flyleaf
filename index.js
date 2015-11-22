'use strict';
/* jshint node:true */

var Express     = require('express'),
    path        = require('path'),
    morgan      = require('morgan'),
    stylus      = require('stylus'),
    routes      = require('./routes'),
    cookieParser= require('cookie-parser'),
    bodyParser  = require('body-parser'),
    multer      = require('multer'),
    webpack     = require('webpack');

var app = Express();

if (process.env.DEV) {
    
    // compiles stylus files to css on the fly
    app.use(stylus.middleware({
        
        src: path.join(__dirname, '/stylus'),
        dest: path.join(__dirname, '/dist'),
        compile: function (string, path) {
            return stylus(string)
            .set('filename', path)
            .set('compress', true);
        }
        
    }));
    
    // webpack files on the fly too
    var webpackCompiler = webpack({
        
        context: path.join(__dirname, '/client'),
        entry: "./index.js",
        output: {
            path: __dirname + "/dist",
            filename: "bundle.js"
        }
        
    });
    
    app.use(function(req, res, next) {
        
        webpackCompiler.run(function (err, stats) {
            
            if (err) console.log(err);
            // console.log(stats);
            next();
            
        });
        
    });
}


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());

app.use(morgan('dev'));
app.use(Express.static(path.join(__dirname + '/dist')));
app.use('/docs', Express.static(path.join(__dirname + '/docs/flyleaf/0.1.0')));
app.use('/material', Express.static(path.join(__dirname + '/node_modules/materialize-css')));

routes(app);

var port = process.env.PORT || 8080;
console.log(port);

app.listen(port, function() {
    console.log('Server started on port ' + port);
});