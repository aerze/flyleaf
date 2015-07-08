'use strict';
/*jshint node:true*/

var searchHandler = require('../search');

module.exports = exports = function(app) {


    app.use('/search/*', searchHandler.update);
    
    app.use('/search/alias/:term?/:end?/:start?', searchHandler.alias);

    app.get('/search/genres/', searchHandler.genres);
    app.post('/search/genres/', searchHandler.genres);
    
    app.get('/search/sorts/', searchHandler.sorts);
    app.post('/search/sorts/', searchHandler.sorts);
};