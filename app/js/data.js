'use strict';
/*jshint browser: true */
/*global Data: true, PouchDB, confirm, alert, page, MangaEden*/
var Data = function() {
    var display = Object.create(Display);
    var mangaEden = new MangaEden();
    var info = {};    
    var db = {
        books: new PouchDB('flyleaf_books'),
        myBooks: new PouchDB('flyleaf_myBooks')
    };
    this._DB = db;

    this.exists = function(callback) {
        getDBInfo(function (dbInfo) {
            if (dbInfo.books.doc_count > 0) callback(dbInfo);
            else callback(null);
        });
    };

    var getDBInfo = function(callback) {
        var dbInfo = {};
        db.books.info(function (err, info) {
            dbInfo.books = info;
            if (dbInfo.myBooks) {
                info = dbInfo;
                callback(dbInfo);
            }
        });

        db.myBooks.info(function (err, info) {
            dbInfo.myBooks = info;
            if (dbInfo.books) {
                info = dbInfo;
                callback(dbInfo);
            }
        });
    };

    this.addBook = function(title, completed) {
        throw NOTYET;
        var book = {
            _id: new Date().toISOString(),
            title: title,
            completed: completed
        };

        db.books.put(book, function (err, result) {
            if (err) throw err;
            else console.log(result);
        });
    };

    this.restoreAllManga = function (callback) {
        // check to see if the books are in pouch, otherwise get them, return them, and put them in.
        mangaEden.getListAll(function (manga, total) {
            display.startLoading('Data', 'Manga');

            db.books.info(function (err, info) {
                console.log(total, info.doc_count);
                if (info.doc_count !== total) {
                    db.books.destroy(function (err) {
                        console.log('data.js:: db.books deleted!');
                        if (err) callback(err);

                        db.books = new PouchDB('flyleaf_books');
                        db.books.bulkDocs(manga, function (err) {
                            if (err) callback(err);
                            else callback(null);
                            // else page('/manga');
                        });
                    });
                } else {
                    console.log('data.js:: DB is up-to-date');
                    callback(null);
                    // page('/manga');
                }
            });
        });
    };

    this.getMyBooks = function (callback) {
        db.myBooks.allDocs({include_docs: true, descending: false}, function (err, docs) {
            if (err) throw err;
            callback(docs.rows);
        });
    };

    this.getAllManga = function (callback) {
        db.books.allDocs({include_docs: true, descending: false}, function (err, docs) {
            if (err) throw err;
            callback(docs.rows);
        });
    };

    this.getMangaByHits = function(callback) {
        var map = function (doc, emit) {
            if (doc.hits) {
                emit(doc.hits);
            }
        };

        var options = {
            include_docs: true, 
            descending: true
        };


        db.books.query(map, options, function (err, response) {
            if (err) throw err;
            callback(response);
        });
    };

    this.resetDB = function() {
        var agree = confirm('Would you like to delete the whole Database? \n Only press ok if you know what you\'re doing.');
        if (agree) {
            db.books.destroy(function (err) {
                if (err) throw err;
                console.log('DB gone!');
                alert('Please refresh the page to complete the reset');
            });
        }
    };
};


// a: "1001"                    =alias
// c: Array[7]                  =category
    // 0: "Adventure"
    // 1: "Fantasy"
    // 2: "Gender Bender"
    // 3: "Harem"
    // 4: "Mystery"
    // 5: "Romance"
    // 6: "Shoujo"
    // length: 7
// h: 101                       =hits
// i: "54de4e17719a162eba1e8e00"=ID
// im:                          =image  
    // "7f/7f2cabd1428954e0ec8312fad8e278150ed3efae2f959d980093c28e.jpg"    
// ld: 1423894550               =last chapter date
// s: 1                         =status
// t: "1001 ..."                =title