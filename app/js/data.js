'use strict';
/*jshint browser: true */
/*global Data: true, PouchDB, ForerunnerDB, confirm, alert, MangaEden, console*/
var Data = function() {


    var mangaEden = new MangaEden();
    var dbInfo = {};
    var db = {};
    var myBooks = {};
    var manga = {};
    // this._DB = db;
    // this._dbInfo = dbInfo;
    // this._manga = manga;


    this.connect = function(callback) {

        db = new ForerunnerDB();
        myBooks = db.collection('myBooks');
        manga = db.collection('manga');
    };

    // This is kinda complicated (to me) but basically it checks to see
    // if both of the databases already exist, but if they don't
    // it loads at lead the new manga information from MangaEden
    this.loadDB = function (callback) {
        myBooks.loaded = -1;
        manga.loaded = -1;

        myBooks.load(function (err) {
            if (err) callback(err, null);
            else {
                myBooks.loaded = myBooks.count();
                if (manga.loaded >= 0 ) {
                    callback(null, {
                        myBooks: myBooks.loaded,
                        manga: manga.loaded
                    });
                }
            }
        });

        manga.load(function (err) {
            if (err) callback(err, null);
            else {
                manga.loaded = manga.count();

                if (manga.loaded === 0) {
                    console.log('Forerunner:: Loading Manga List');
                    loadMangaList(function (err, total) {
                        if (err) callback(err, null);
                        else {
                            console.log(total);
                            callback(null, {
                                myBooks: myBooks.loaded,
                                manga: manga.loaded
                            });
                        }
                    });
                } else if (myBooks.loaded >= 0) {
                    callback(null, {
                        myBooks: myBooks.loaded,
                        manga: manga.loaded
                    });
                }
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

    var loadMangaList = function (callback) {
        mangaEden.getListAll(function (err, mangaList, total) {
            if (err) callback(err, null);
            console.log(manga[0]);
            manga.setData(mangaList);
            manga.save(function (err) {
                if (err) callback(err, null);
                else {
                    manga.loaded = total;
                    console.log(this);
                    callback(null, total);
                }
            });
        });
    };

    this.count = function (dbName) {
        return db.collection(dbName).count();
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
        manga.ensureIndex({
            name:1,
            hits:1
        });
        manga.save(function (err) {
            if (err) console.log('ForerunnerDB:: Could not index manga');
        });
        console.log('Forerunner:: manga: indexed');
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

    this.top = function (amount, dbName) {
        dbName = dbName || 'manga';

        return db.collection(dbName).find({},{
            $orderBy: {
                hits: -1
            },
        }).slice(0, amount);
    };

    this.search = function (searchString, dbName) {
        dbName = dbName || 'manga';
        var re = new RegExp('^' + searchString + '.*', 'i');
        var list = db.collection(dbName).find({
            title: re
        },{
            $orderBy: {
                hits: -1
            }
        });
        return list;
    };

    this.getMangaByHits = function() {
        return manga.find({},{
            $orderBy: {
                hits: -1
            },
        }).slice(0, 50);
    };

    this.sample = function() {
        return manga.find()
    }

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
        var book = myBooks.find({_id: id});
        if (book.length > 0) {
            callback(null, book[0]);
        } else {
            mangaEden.getManga(id, function (err, manga) {
                manga._id = id;
                callback(err, manga);
            });
        }
    };

    this.getChapterInfo = function (id, callback) {
        var book = myBooks.find({_id: id});
        if (book.length > 0) {
            callback(null, book);
        } else {
            mangaEden.getChapter(id, callback);
        }
    };

    this.checkLibrary = function (id) {
        var count =  myBooks.count({_id: id});
        return (count > 0 );
    };

    this.getLibrary = function (callback) {
        var library = myBooks.find();
        if (library === 0) callback(new Error('Library Empty'), null);
        else callback(null, library);
    };

    this.saveBook = function (book, callback) {
        myBooks.insert(book);
        myBooks.save(function (err) {
            if (err) callback(err);
            else callback(null);
        });
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