'use strict';
/*global Display, Data, page, console*/

var Flyleaf = function() {
    var display = Object.create(Display);
    var data = new Data();

    var _manga = [];
    var _myBooks = [];
    var _dbInfo = {};
    var _initalLoad = false;

    var init = function (callback) {
        console.log(_initalLoad);
        if (_initalLoad)  return callback(null, _dbInfo);
        
        display.startLoading('Flyleaf', 'Initialization');
        loadDB(function (err, dbInfo) {
            if (err) console.log(err);

            loadManga(function (err) {
                if (err) console.log(err);

                if (dbInfo.myBooks.doc_count > 0) {

                    loadMyBooks(function (err) {
                        if (err) console.log(err);
                        complete();
                    });

                } else {
                    complete();
                }
                
                function complete() {
                    _initalLoad = true;
                    console.log(dbInfo);
                    display.endLoading('Flyleaf', 'Initialization');
                    callback(null, dbInfo);
                }
            });
        });
    };

    var loadDB = function (callback) {
        if (_initalLoad === false) {
            display.startLoading('Flyleaf', 'Manga:Database');
            // Checks for existting DB and that books are loaded.
            data.exists(function (dbInfo) {
                if (dbInfo) {
                    display.endLoading('Flyleaf', 'Manga:Database');
                    callback(null, dbInfo);
                } else {
                    data.restoreAllManga(function (err) {
                        display.endLoading('Flyleaf', 'Manga:Database');
                        callback(err, dbInfo);
                    });
                }
            });
        }
    };

    var loadManga = function(callback) {
        display.startLoading('Flyleaf', 'Manga:LocalMemory');
        data.getAllManga(function (manga) {
            _manga = manga;
            manga = null; //TODO research if making this null helps release the variable.
            display.endLoading('Flyleaf', 'Manga:LocalMemory');
            callback(null);
        });
    };

    var loadMyBooks = function(callback) {
        display.startLoading('Flyleaf', 'MyBooks:LocalMemory');
        data.getMyBooks(function (myBooks) {
            _myBooks = myBooks;
            myBooks = null;
            display.endLoading('Flyleaf', 'MyBooks:LocalMemory');
            callback(null);
        });
    };

    this.home = function () {
        init(function(err, dbInfo) {
            _dbInfo = dbInfo;
            console.log('Flyleaf:: Initialization Complete');

            page('/myBooks');
        });
    };

    this.myBooks = function () {
        init(function(err, dbInfo) {
            if (err) console.log(err);
            if (dbInfo.myBooks.doc_count > 0) {
                display.mangaList(_myBooks, function() {
                    console.log('Flyleaf:: Displaying MyBooks');
                });
            } else {
                display.error('No Books saved!\nGo to the search page to find some.'); 
            }
        });
    };

    this.search = function() {
        init(function(err, dbInfo) {
            if (err) console.log(err);
            if (dbInfo.books.doc_count > 0) {
                display.startLoading('Flyleaf', 'Manga:Search');
                display.search(flyleaf._sortByHits(_manga), function() {
                    display.endLoading('Flyleaf', 'MyBooks:Search');
                });
            } else {
                display.error('No Manga found, I have no idea what happened.\n Contact @mythrilco on Twitter maybe?');
            }
        });


    };

    this.settings = function () {
        display.renderString('Nothing here yet');
    };

    this.aboutUs = function () {
        display.renderString('Twitter: @mythrilco');
    };

    this.manga = function (req) {
        console.log(req.params);
        data.getMangaInfo(req.params.id, function (mangaInfo) {
            display.manga(mangaInfo);
        });
    };

    this._getManga = function() {
        return _manga;
    };

    this._sortByHits = function(mangaArray) {
        var sorted = [];
        sorted = mangaArray.sort(function (a, b) {
            return a.doc.hits - b.doc.hits;
        });
        return sorted;
    };
};