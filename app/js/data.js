'use strict';
/*jshint browser: true */
/*global Data: true, ForerunnerDB, confirm, alert, MangaEden, console*/


/**
 * Interface for all things data.
 * Database, API, Net
 * @constructor
 */
var Data = function() {

    var mangaEden = new MangaEden();
    var db = {};
    var myBooks = {};
    var manga = {};

    /**
     * Connect to the browser's DB
     * Must be run before using anyother methods
     */
    this.connect = function() {
        db = new ForerunnerDB();
        myBooks = db.collection('myBooks');
        manga = db.collection('manga');
    };


    /**
     * Ensures that both the Library and catalog are loaded.
     * If the Catalog is empty, it will reload it from the 
     * MangaEden API (accesses the Internet)
     * @param  {Data~loadedDB} callback - Called with Err and BookCount
     * as  parameters after the database is loaded
     */
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
                    console.log('Forerunner:: Loading Catalog for first time');
                    loadCatalog(function (err, total) {
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
    /**
     * @callback Data~loadedDB
     * @param {Error} err - DB load error
     * @param {BookCount} BookCount - Object with amount of books loaded 
     * per collection
     */



     /*
      * Reloads the Catalog from the MangaEden API
      * @param  {Data~loadedCatalog} callback Called when the DB has been loaded 
      * or error has occured
      */
    var loadCatalog = function (callback) {
        mangaEden.getListAll(function (err, catalog, total) {
            if (err) callback(err, null);
            console.log(manga[0]);
            manga.setData(catalog);
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
    /*
     * @callback Data~loadedCatalog
     * @param {Error} err - Could be Database loading, MangaEden API, or Net error
     * @param {Integer} total - Amount of records loaded
     */



     /**
      * Gets amount of records in collection
      * @param  {collectionName} name Name of the collection
      * @return {number}        Amount of records in the collection
      */
    this.count = function (name) {
        return db.collection(name).count();
    };


    // this.getMyBooks = function (callback) {
    //     db.myBooks.allDocs({include_docs: true, descending: false}, function (err, docs) {
    //         if (err) callback(err, null);
    //         else callback(null, docs.rows);
    //     });
    // };

    // this.getAllManga = function (callback) {
    //     db.books.allDocs({include_docs: true, descending: false}, function (err, docs) {
    //         if (err) callback(err, null);
    //         else callback(null, docs.rows);
    //     });
    // };

    /**
     * Creates an index in the Catalog collection
     * @param  {callback} callback Called after indexing completes with error as parameter
     */
    this.indexDB = function (callback) {
        manga.ensureIndex({
            name:1,
            hits:1
        });
        manga.save(function (err) {
            if (err) callback(err);
            else callback(null);
        });
    };


    // this.getIndex = function () {
    //     db.books.getIndexes()
    //     .then(function (result) {
    //         console.log(result);
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //     });
    // };


    /**
     * Returns the top amount of records from the collection
     * @param  {int} amount Amount of records to return
     * @param  {collectionName} name Name of collection to use,
     * Defaults to 'manga'
     * @return {array}        An array of records
     */
    this.top = function (amount, name) {
        name = name || 'manga';
        return db.collection(name).find({},{
            $orderBy: {
                hits: -1
            },
        }).slice(0, amount);
    };


    /**
     * Search a collection for all books where name includes searchString
     * @param  {string} searchString string to match against name
     * @param  {collectionName} name name of collection to search
     * @return {array} returns an array of all matching records
     */
    this.search = function (searchString, name) {
        name = name || 'manga';
        var re = new RegExp('^' + searchString + '.*', 'i');
        var list = db.collection(name).find({
            title: re
        },{
            $orderBy: {
                hits: -1
            }
        });
        return list;
    };


    /**
     * Return a sample record frmo a collection
     * @param {collectionName} name Name of Collection to use
     * @return {array} an array with one record
     */
    this.sample = function(name) {
        return db.collection(name).find()[0];
    };


    /**
     * Delete a collection
     * @param  {Data~collectionName}   name     Name of collection to delete
     * @param  {bool}   override Overrides the confirmation box
     * @param  {Callback} callback Called after deletion completes with err as param
     */
    this.deleteCollection = function(name, override, callback) {
        if (override) {
            remove(name, callback);
        } else {
            var agree = confirm('Would you like to delete the whole Database? \n Only press ok if you know what you\'re doing.');
            if (agree) remove(name, callback);            
        }

        function remove(name, callback) {
            db.collection(name).setData([]);
            db.collection(name).save(function (err) {
                if (err) callback(err);
                else {
                    console.log('Collection deleted');
                    callback(null);
                }
            });
        }
    };


    /**
     * Retrieves meta info for a book given the _id
     * @param  {string}   id       The _id of a book
     * @param  {Function} callback Called with err and book record as params
     */
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
/**
 * @typedef Data~collectionName
 * @type {string}
 * @default 'manga'
 */

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