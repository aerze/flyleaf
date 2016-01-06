'use strict';

var ForerunnerDB = require('forerunnerdb');
var net = require('../net.js');
var mangaEden = require('../MangaEden.js');

var fdb = new ForerunnerDB();
var db = fdb.db('flyleafco');
var libraryCollection, cacheCollection;

var Data = {

    cache:{},

    init: function () {
        this.library.db = db.collection('library');
        this.cache = db.collection('cache');
        this.cache.load();

        libraryCollection = this.library.db;
        cacheCollection = this.cache;
        // this.info = fdb.collection('info');
    },

    library: {
        init: function (callback) {

            var library = this.db;

            library.load(function (err) {

                if (err) callback(err, null);
                else callback(null, {length: library.count()});

            });
        }
    },

    search: {
        top: function (callback) {
            this.run({string: '', sort: 'hits'}, callback);
        },

        run: function (options, callback) {
            var path = '/search/alias/' + options.string;
            var json = {};

            if (options) {
                if (options.end) json.end = options.end;
                if (options.start) json.start = options.start;
                if (options.all ) json.end = -1; json.start = -1;
                if (options.sort) json.sort = options.sort;
                if (options.genres) {
                    if (options.genres.good.length > 0) {
                        json.good = options.genres.good;
                    }
                }
            }

            if (json) {
                net.postJson(path, json, function (err, data) {
                    callback(err, data);
                });
            } else {
                net.getJson(path, function (err, data) {
                    callback(err, data);
                });
            }
        },

        getGenres: function (callback) {

            net.getJson('/search/genres', function (err, data) {

                if (err) callback(err, null);
                else callback(null, data);

            });
        }
    },

    manga: {
        get: function (id, callback) {

            if (!id || id === '123') callback(new Error('MangaID Missing'), null);

            var book = libraryCollection.find({_id: id});
            if (book.length > 0) {
                callback(null, book);
            } else {
                mangaEden.manga(id, function (err, book) {
                    book._id = id;
                    callback(err, book);
                });
            }

        }
    },

    chapter: {
        get: function (id, callback) {

            if(!id) callback(new Error('ChapterID Missing'), null);

            mangaEden.chapter(id, function (err, chapter) {
                callback(err, chapter);
            });
        }
    }
};


module.exports = Data;