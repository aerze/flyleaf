'use strict';
/*jshint node:true*/

var search = require('./search');

search.updateCatalog(function (err) {
    if (err) console.log(err);
    else console.log('Search:: catalog in memory');
});

var searchHandler = {
    update: function (req, res, next) {
        search.updateCatalog();
        next();
    },




    genres: function (req, res) {
        search.genres(function(err, data) {
            if (err) res.json(err);
            else res.json(data); 
        });
    },
	
	sorts: function (req, res) {
		search.sortOptions(function (err, data) {
			if (err) res.json(err);
			else res.json(data);
		})	;
	},



    alias: function (req, res) {
        var term = req.params.term || '',
            end = req.params.end || 10,
            start = req.params.start || -1,
            filter = (req.body.goodGenres || req.body.badGenres) ? false: true,
            sort = req.body.sort || 'hits',
            goodGenres = req.body.good || [],
            badGenres = req.body.bad || [];

        var results = search.term(term);

        if (filter) {
            results.keep(goodGenres);
            results.remove(badGenres);
        }

        if (sort) results.sortBy(sort);
        
        if (start >  -1) {
            var diff = end - start;
            results = results.splice(start, diff);
        } else results = results.splice(0, end); 
        
        res.json(results);
    }
};


module.exports = searchHandler;