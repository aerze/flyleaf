'use strict';
/*jshint node:true*/

var Firebase = require('firebase');

var mangaedenRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden');
var mangaRef = mangaedenRef.child('manga');

var catalog = [],
    genres = [],
	sorts = [],
    lastUpdated = null,
    updating = false;


var objToArray = function (object) {
    var array = [];
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            array.push(object[key]);
        }
    } return array;
};

var hitsAscending = function (a, b) {
  return b.hits - a.hits;
};




var search = {
    updateCatalog: function (callback) {
        var hour = 1000*60*60;
        var newDate = new Date();
        if (updating === true) return;
        if ( (newDate - lastUpdated >= hour ) || lastUpdated === null) {
            updating = true;
            mangaRef.once('value', function (snap) {
                catalog = objToArray(snap.val())
                    .sort(hitsAscending);
                lastUpdated = new Date();
                console.log('Search:: catalog updated');
                updating = false;
                callback(null);

            }, function (err) {
                callback(err);
            });
        } else {
            console.log('Search:: catalog unchanged');
            callback(null);
        }
    },

	sortOptions: function (callback) {
		if (sorts.length > 0) {
            callback(null, sorts);
            return;
        } else {
            mangaedenRef.child('meta').child('sorts').once('value', function (snap) {
                var array = [],
                    object = snap.val();
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        array.push(key);
                    }
                }
                callback(null, array);
                sorts = array;
            }, function (err) {
                callback(err, null);
            });
        }
	},

    genres: function (callback) {
        if (genres.length > 0) {
            callback(null, genres);
            return;
        } else {
            mangaedenRef.child('meta').child('genres').once('value', function (snap) {
                var array = [],
                    object = snap.val();
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        array.push(key);
                    }
                }
                callback(null, array);
                genres = array;
            }, function (err) {
                callback(err, null);
            });
        }
    },

    top: function (req, res) {
        var start   = parseInt(req.params.start) - 1  || 0,
            end     = parseInt(req.params.end) -1    || 10,
            diff    = end - start;
        var clean   = [];

        if (diff < 0) res.status(400).send('Bad Request - End is before Start');

        for (var i = start; i <= end; i++) {
            clean.push(catalog[i]);
        }

        console.log(start, end, diff);

        if (req.query) {
            res.send(queryFilter(clean, req.query));
        } else {
            res.send(clean);
        }
    },

    title: function (req, res) {
        var start   = parseInt(req.params.start) - 1  || 0,
            end     = parseInt(req.params.end) -1    || 10,
            diff    = end - start;
            if (diff < 0) res.status(400).send('Bad Request - End is before Start');

        var term = req.params.term || '';
        var clean = [];
        var re = new RegExp('^' + term + '.*', 'i');

        if (term === '') {
            console.log('Search:: searching for: all');
            clean = catalog.slice(0);
        } else {
            console.log('Search:: searching for: ' + term);
            for (var i = 0; i <= catalog.length - 1; i++) {
                if (re.test(catalog[i].alias)) {
                    clean[clean.length] = catalog[i];
                }
            }
        }

        if (req.query) {
            res.send(queryFilter(clean, req.query));
        } else {
            res.send(clean);
        }
    },

    term: function (term) {
        var books = [],
            re = new RegExp('^' + term + '.*', 'i');

        for (var i = catalog.length - 1; i >= 0; i--) {
            if (term.length < 1 || re.test(catalog[i].alias) || re.test(catalog[i].title)) {
                books.push(catalog[i]);
            }
        }
        
        books.remove = function (badGenres) {
            for (var i = this.length - 1; i >= 0; i--) {
                var currentBook = this[i];

                for (var key in currentBook.genre) {
                   if (currentBook.genre.hasOwnProperty(key)) {
                        var currentGenre = key;

                        for (var j = badGenres.length - 1; j >= 0; j--) {
                            if (badGenres[j].toLowerCase() === currentGenre.toLowerCase()) {
                                this.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
        };

        books.keep = function (goodGenres) {
            // loop through each book object
            for (var i = this.length - 1; i >= 0; i--) {
                var currentBook = this[i];

                // loop through genre filters
                for (var j = goodGenres.length - 1; j >= 0; j--) {
                    var match = false;

                    // loop through genres in current book
                    for (var key in currentBook.genre) {
                       if (currentBook.genre.hasOwnProperty(key)) {
                            var currentGenre = key;

                            if (goodGenres[j].toLowerCase() === currentGenre.toLowerCase()) {
                                match = true;
                            }

                        }
                    }

                    if (!match) {
                        this.splice(i, 1);
                        break;
                    }
                }
            }
        };

        books.sortBy = function (type) {
            if (type === 'hits') {
                this.sort(hitsAscending);
            }
        };

        return books;
    },

    sort: function () {

    }
};

var queryFilter = function (array, queryObj) {
    var goodGenres = [],
        badGenres = [];
    for (var key in queryObj) {
        if (queryObj.hasOwnProperty(key)) {
            if (queryObj[key] === 'true') goodGenres.push(key);
            else if (queryObj[key] === 'false') badGenres.push(key);
        }
    }
    return filter(array, goodGenres, badGenres);
};

var filter = function (books, goodGenres, badGenres) {
    for (var i = goodGenres.length - 1; i >= 0; i--) {
        books = goodGenreFilter(books, goodGenres[i]);
    }

    if (badGenres) {
        for (var j = badGenres.length - 1; j >= 0; j--) {
            books = badGenreFilter(books, badGenres[j]);
        }
    }
    return books;
};

var goodGenreFilter = function (bookArray, filterGenre) {
    var filterArray = [];

    for (var i = bookArray.length - 1; i >= 0; i--) {
        var currentBook = bookArray[i];

        for (var key in currentBook.genre) {
           if (currentBook.genre.hasOwnProperty(key)) {
                var currentGenre = key;

                if (filterGenre.toLowerCase() === currentGenre.toLowerCase()) {
                    filterArray.push(currentBook);
                    break;
                }
            }
        }
    }
    console.log(filterArray.length);
    return filterArray;
};

var badGenreFilter = function (bookArray, filterGenre) {
    var filterArray = [];

    for (var i = bookArray.length - 1; i >= 0; i--) {
        var currentBook = bookArray[i];

        for (var key in currentBook.genre) {
           if (currentBook.genre.hasOwnProperty(key)) {
                var currentGenre = key;

                if (filterGenre !== currentGenre) {
                    filterArray.push(currentBook);
                    break;
                }
            }
        }
    }
    return filterArray;
};

module.exports = search;


var Books = {};