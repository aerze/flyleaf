'use strict';
/*jshint browser: true */
/*global Data: true, PouchDB, confirm, alert, MangaEden, console*/
var Data = function() {
    PouchDB.debug.enable('pouchdb:find');

    var mangaEden = new MangaEden();
    var dbInfo = {};
    var db = {
        books: {},
        myBooks: {}
    };

    this._DB = db;
    this._dbInfo = dbInfo;

    this.connect = function(callback) {
        db.books = new PouchDB('flyleaf_books');
        db.myBooks = new PouchDB('flyleaf_myBooks');
    };

    // This is kinda complicated (to me) but basically it checks to see
    // if both of the databases already exist, but if they don't
    // it loads at lead the new manga information from MangaEden
    this.getDBInfo = function (callback) {
        db.books.info(function (err, info) {
            if (err) callback(err, null);
            else {
                dbInfo.books = info;
                if (dbInfo.books.doc_count <= 0) {
                    pullMangaList(function (err, total) {
                        if (err) console.log(err);
                        else (dbInfo.books.doc_count = total);
                    });
                }
                if (dbInfo.myBooks) callback(null, dbInfo);
            }
        });
        db.myBooks.info(function (err, info) {
            if (err) callback(err, null);
            else {
                dbInfo.myBooks = info;
                if (dbInfo.books) callback(null, dbInfo);
            }
        });
    };

    // this.addBook = function(title, completed) {
    //     throw new Error('Not Yet');
    //     var book = {
    //         _id: new Date().toISOString(),
    //         title: title,
    //         completed: completed
    //     };

    //     db.books.put(book, function (err, result) {
    //         if (err) throw err;
    //         else console.log(result);
    //     });
    // };

    var pullMangaList = function (callback) {
        mangaEden.getListAll(function (manga, total) {
            db.books.destroy(function (err) {
                if (err) callback(err, null);
                db.books = new PouchDB('flyleaf_books');
                db.books.bulkDocs(manga, function (err) {
                    if (err) callback(err, null);
                    else callback(null, total);
                });
            });
        });
    };

    this.getMyBooks = function (callback) {
        db.myBooks.allDocs({include_docs: true, descending: false}, function (err, docs) {
            if (err) callback(err, null);
            else callback(null, docs.rows);
        });
    };

    this.getAllManga = function (callback) {
        db.books.allDocs({include_docs: true, descending: false}, function (err, docs) {
            if (err) callback(err, null);
            else callback(null, docs.rows);
        });
    };


    this.indexDB = function () {
        db.books.createIndex({
            index: {fields: ['hits', 'name']}
        })
        .then(function (result) {
            console.log(result);
        })
        .catch(function (err) {
            console.log(err);
        });
    };

    this.getIndex = function () {
        db.books.getIndexes()
        .then(function (result) {
            console.log(result);
        })
        .catch(function (err) {
            console.log(err);
        });
    };

    this.getMangaByHits = function(callback) {
        console.log('running');

        db.books.find({
            selector: {hits: {$exists: true}},
            sort: [{hits: 'desc'}],
            limit: 25
        })
        .then(function (result) {
            console.log(result);
            callback(null, result);
        })
        .catch(function (err) {
            console.log(err);
            callback(err, null);
        });

        // var map = function (doc, emit) {
        //     if (doc.hits) {
        //         emit(doc.hits);
        //     }
        // };

        // var options = {
        //     include_docs: true, 
        //     descending: true,
        //     limit: 25
        // };

        // db.books.query(map, options, function (err, response) {
        //     if (err) throw err;
        //     callback(response);
        // });
    };

    this.removeDB = function(override) {
        if (override) {
            remove();
            return;
        }        
        var agree = confirm('Would you like to delete the whole Database? \n Only press ok if you know what you\'re doing.');
        if (agree) remove();

        function remove() {
            db.books.destroy(function (err) {
                if (err) throw err;
                console.log('DB gone!');
                alert('Please refresh the page to complete the reset');
            });
        }
    };

    this.getMangaInfo = function (id, callback) {
        mangaEden.getManga(id, callback);
    };

    this.getChapterInfo = function (id, callback) {
        mangaEden.getChapter(id, callback);
    };
};

// returned from a getManga request
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