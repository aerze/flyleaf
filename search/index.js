'use strict';
/*jshint node:true*/

var search = require('./search');

search.updateCatalog(function (err) {
    if (err) console.log(err);
    else console.log('Search:: catalog in memory');
});

var searchHandler = {
    update: function (req, res, next) {
        search.updateCatalog(function (err) {
            if (err) console.log(err);
        });
        next();
    },




    genres: function (req, res) {
        search.genres(function(err, data) {
            if (err) res.json(err);
            else res.json(data); 
        });
    },





    alias: function (req, res) {
        var term = req.params.term || '',
            filter = (req.body.goodGenres || req.body.badGenres) ? false: true,
            sort = req.body.sort || 'hits',
            goodGenres = req.body.good || [],
            badGenres = req.body.bad || [];

            console.log(filter);

        var results = search.term(term);

        if (filter) {
            results.keep(goodGenres);
            results.remove(badGenres);
        }

        if (sort) results.sortBy(sort);
        

        res.json(results);
    }
};


module.exports = searchHandler;