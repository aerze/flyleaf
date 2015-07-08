'use strict';
/*jshint node:true*/

var searchHandler = require('../search');

module.exports = exports = function(app) {


    app.use('/search/*', searchHandler.update);
    
    app.post('/search/alias/:term?', searchHandler.alias);

    app.get('/search/genres/', searchHandler.genres);

};