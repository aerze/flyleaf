'use strict';
/*jshint browser: true */
/*global Data: true, ForerunnerDB, confirm, MangaEden, console*/


/**
 * Interface for the internal DB, Creates and holds connections to two
 * collections.
 * Data searches for any item in the DB before trying to use the online API.
 * Library: Holds detailed information of the user's books.
 * Catalog: Holds basic information of books available on MangaEden.
 * @constructor
 */
var Data = function () {

    var mangaEden = new MangaEden();
    var db = {};
    var library = {};
    var catalog = {};

    /**
     * Connect to ForerunnerDB, or create a new instance for this domain name.
     * Must be run before using any other methods will work.
     */
    this.connect = function () {
        db = new ForerunnerDB();
        library = db.collection('library');
        catalog = db.collection('catalog');
    };


    /**
     * Ensures that both the Library and Catalog are loaded.
     * If the Catalog is empty, it will re-download it from the
     * MangaEden API (requires an Internet connection). Callback fires
     * once the DB connection is loaded.
     * @param  {Function} callback - callback(err, [DBCount]{@link Data~DBCount})
     */
    this.loadDB = function (callback) {
        library.loaded = -1;
        catalog.loaded = -1;

        library.load(function (err) {
            if (err) callback(err, null);
            else {
                library.loaded = library.count();
                if (catalog.loaded >= 0 ) {
                    callback(null, {
                        library: library.loaded,
                        catalog: catalog.loaded
                    });
                }
            }
        });

        catalog.load(function (err) {
            if (err) callback(err, null);
            else {
                catalog.loaded = catalog.count();

                if (catalog.loaded === 0) {
                    console.log('Forerunner:: Loading Catalog for first time');
                    downloadCatalog(function (err, total) {
                        if (err) callback(err, null);
                        else {
                            console.log(total);
                            callback(null, {
                                library: library.loaded,
                                catalog: catalog.loaded
                            });
                        }
                    });
                } else if (library.loaded >= 0) {
                    callback(null, {
                        library: library.loaded,
                        catalog: catalog.loaded
                    });
                }
            }
        });
    };



     /*
      * Downloads the Catalog from the MangaEden API Calls back when the DB has
      * been loaded or error has occurred.
      * @param  {Function} callback callback(err, totalSaved<int>)
      */
    var downloadCatalog = function (callback) {
        mangaEden.getFullList(function (err, mangaList, total) {
            if (err) callback(err, null);
            catalog.setData(mangaList);
            catalog.save(function (err) {
                if (err) callback(err, null);
                else {
                    catalog.loaded = total;
                    callback(null, total);
                }
            });
        });
    };



     /**
      * Gets amount of records in collection.
      * @param  {CollectionName} name Name of the collection
      * @return {Int} Amount of records in the collection
      */
    this.count = function (name) {
        return db.collection(name).count();
    };



    /**
     * Creates an index in the Catalog collection, callback fires after
     * successful save.
     * @param  {Function} callback callback(err)
     */
    this.indexCollection = function (name, callback) {
        if (name === 'catalog') {
            catalog.ensureIndex({
                title:1,
                hits:1
            });
            catalog.save(function (err) {
                if (err) callback(err);
                else callback(null);
            });
        } else {
            db.collection(name).ensureIndex({
                title:1
            });
            db.collection(name).save(function (err) {
                if (err) callback(err);
                else callback(null);
            });
        }
    };



    /**
     * Returns the top amount of records from the collection by popularity.
     * @param  {CollectionName} name Name of collection to use,
     * defaults to 'catalog'
     * @param  {Int} amount Amount of records to return
     * @return {Array}  An array of records
     */
    this.top = function (name, amount) {
        name = name || 'catalog';
        return db.collection(name).find({},{
            $orderBy: {
                hits: -1
            },
        }).slice(0, amount);
    };



    /**
     * Search a collection for all books where name includes searchString.
     * @param  {CollectionName} name name of collection to search
     * @param  {String} searchString string to match against name
     * @return {Array} returns an array of all matching records
     */
    this.search = function (name, searchString) {
        name = name || 'catalog';
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
     * Return a sample record from a collection.
     * @param {CollectionName} name Name of Collection to use
     * @return {MangaDetailInfo|MangaBasicInfo}
     */
    this.sample = function (name) {
        return db.collection(name).find()[0];
    };



    /**
     * Delete a whole collection.
     * @param  {Data~collectionName} name Name of collection to delete
     * @param  {Boolean} override Overrides the confirmation box
     * @param  {Function} callback callback(err)
     */
    this.deleteCollection = function (name, override, callback) {
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
     * Remove a record from a collection using it's _id
     * @param  {Data~collectionName}   name     Name of the Collection to use
     * @param  {String}   id       _id of the record to remove
     * @param  {Function} callback callback(err)
     */
    this.remove = function (name, id, callback) {
        db.collection(name).remove({_id: id});
        db.collection(name).save(function (err) {
            if (err) callback(err);
            else callback(null);
        });
    };



    /**
     * Retrieves {@link MangaDetailInfo} of given the _id.
     * @param  {string}   id       The _id of a book
     * @param  {Function} callback callback(err, [manga]{@link MangaDetailInfo})
     */
    this.getMangaInfo = function (id, callback) {
        var book = library.find({_id: id});
        if (book.length > 0) {
            callback(null, book[0]);
        } else {
            mangaEden.getManga(id, function (err, book) {
                book._id = id;
                callback(err, book);
            });
        }
    };



    /**
     * Retrieves {@link ChapterImages} of the given the _id.
     * @param  {String}   id       _id of the chapter
     * @param  {Callback} callback callback(err, [chapter]{@link ChapterImages})
     */
    this.getChapterInfo = function (id, callback) {
        var book = library.find({_id: id});
        if (book.length > 0) {
            callback(null, book);
        } else {
            mangaEden.getChapter(id, callback);
        }
    };


    /**
     * Check whether or not a book's information has been stored locally.
     * @param  {String} id _id of book
     * @return {Boolean}    True if book is stored in the library
     */
    this.checkLibrary = function (id) {
        var count =  library.count({_id: id});
        return (count > 0 );
    };



    /**
     * Retrieves an array of {@link MangaDetailInfo} with all the books
     * currently in the library.
     * @param  {Function} callback
     * callback(err, [MangaArray]{@link MangaDetailInfo})
     */
    this.getLibrary = function (callback) {
        var mangaList = library.find();
        if (mangaList === 0) callback(new Error('Library Empty'), null);
        else callback(null, mangaList);
    };



    /**
     * Stores a book in the library.
     * As of version 0.1.0 no type checking is done before storing and
     * will pretty much just store whatever you give.
     * @param  {MangaDetailInfo}   book     A Manga Object
     * @param  {Callback} callback callback(err)
     */
    this.saveBook = function (book, callback) {
        library.insert(book);
        library.save(function (err) {
            if (err) callback(err);
            else callback(null);
        });
    };


    this.readChapter = function (id, chapterPos, page) {
        var book = library.find({_id: id});
        var array = book[0].chapters;
            array[chapterPos][4] = page;
        library.updateById(id, {chapters: array});
        library.save();
    };
};

/**
 * @typedef MangaBasicInfo
 * @typedef {Object}
 * @property {String} _id Unique Id for Manga
 * @property {String} alias URL-friendly version of the title
 * @property {String} coverImage Image location, must be appended
 * to "https://cdn.mangaeden.com/mangasimg/"
 * @property {Array} genre Contains a list of genre tags, in no particular order
 * @property {Int} hits Number of hits on MangaEden, used to determine popularity
 * @property {Int} lastChapterDate The date of the latest chapter update in
 * Unix Epoch Time use new Date(MangaBasicInfo.lastChapterDate * 1000) to get
 * the JS Date format
 * @property {Int} status I'm not sure what this is yet
 * @property {String} title Title of book
 */

/**
 * @typedef MangaDetailInfo
 * @type {Object}
 * @property {String} _id Unique Id for Manga
 * @property {Array} aka Alternate names including ones in other languages
 * @property {Array} aka-alias URL friendly versions of aka
 * @property {String} alias URL-friendly version of the title
 * @property {String} artist Credited artist
 * @property {Array} artist-kw Artist names split by spaces
 * @property {String} author Credited author
 * @property {Array} author-kw Author names split by spaces
 * @property {Boolen} baka Unknown use, from MangaEden API though 'baka' means
 * stupid so..
 * @property {Array} categories List of genre tags
 * @property {Array} chapters Array of [ChapterBasicInfo]{@link ChapterBasicInfo}
 * for this manga
 * @property {Int} chapters_len length of chapters array
 * @property {String} description Description of manga
 * @property {Int} hits Number of hits on MangaEden, used to determine popularity
 * @property {String} image Image location, must be appended
 * to "https://cdn.mangaeden.com/mangasimg/"
 * @property {String} imageURL Another URL for the same image as above
 * @property {Int} language Language of book (0 is for English);
 * @property {Int} last_Chapter_Date The date of the latest chapter update in
 * Unix Epoch Time use new Date(MangaDetailInfo.last_Chapter_Date * 1000) to
 * get the JS Date format
 * @property {Array} random Unknown use, from MangaEden API
 * @property {Int} released Year of release
 * @property {String} startsWith character that title starts with
 * @property {Int} status Unknown use, from MangaEden API
 * @property {String} title Title of book
 * @property {Array} title_kw Title split by spaces
 * @property {Int} type Unknown use, from MangaEden API
 * @property {Boolean} updatedKeywords Unknown use, from MangaEden API
 */

/**
 * @typedef {Array} ChapterBasicInfo
 * @property {Int} 0 Chapter number
 * @property {Int} 1 Chapter upload date in Unix Epoch Time
 * use new Date(MangaDetailInfo.last_Chapter_Date * 1000)
 * to get the JS Date format
 * @property {String} 2 Chapter title
 * @property {String} 3 Chapter _id
 */

/**
 * @typedef {Object} ChapterImages
 * @property {Array} images Array of [ImageInfo]{@link ImageInfo} objects
 */

/**
 * @typedef {Array} ImageInfo
 * @property {Int} 0 Page number
 * @property {String} 1 Image location, must be appended
 * to "https://cdn.mangaeden.com/mangasimg/"
 * @property {Int} 2 Unknown use, from MangaEden API
 * @property {Int} 3 Unknown use, from MangaEden API
 */

/**
 * @typedef Data~collectionName
 * @description Flyleaf uses two collections 'Library' and 'Catalog'
 * @type {string}
 */


 /**
  * @typedef Data~DBCount
  * @description Used in the loadDB callback function (see {@link Data#loadDB})
  * @type {Object}
  * @property {Int} library - number of records in library collection
  * @property {Int} catalog - number of records in catalog collection
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