'use strict';
/*global Display, Data, page*/

var Flyleaf = function() {
    var display = Object.create(Display);
    var data = new Data();

    var _manga = [];
    var _myBooks = [];
    var _initalLoad = false;


    var loadDB = function (callback) {
        if (_initalLoad === false) {
            display.startLoading('Flyleaf', 'Manga:Database');
            // Checks for existting DB and that books are loaded.
            data.exists(function (dbInfo) {
                if (dbInfo) {
                    display.endLoading('Flyleaf', 'Manga:Database');
                    _initalLoad = true;
                    callback(dbInfo);
                } else {
                    data.restoreAllManga(function () {
                        display.endLoading('Flyleaf', 'Manga:Database');
                        _initalLoad = true;
                        callback(dbInfo);
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
            callback();
        });
    };

    var loadMyBooks = function(callback) {
        debugger;
        display.startLoading('Flyleaf', 'MyBooks:LocalMemory');
        data.getMyBooks(function (myBooks) {
            _myBooks = myBooks;
            myBooks = null;
            display.endLoading('Flyleaf', 'MyBooks:LocalMemory');
            callback();
        });
    };

    this.home = function () {
        loadDB(function (dbInfo) {
            if (dbInfo.myBooks.doc_count > 0) {
                loadManga(function () {
                    loadMyBooks(function () {
                        page('/myBooks');
                    });
                });
            } else {
                loadManga(function () {
                    page('/myBooks');
                });
            }
        });
    };

    this.search = function(path) {
        console.log(path.path);
    };

    this.myBooks = function () {
        console.log(data.getMyBooks());
        // var list = [];
        // var books = data.getMyBooks();
        // for (var i = books.length - 1; i >= 0; i--) {
        //     var item = document.createElement('li');
        //     item.innerHTML = 'Its called ' + books[i].name + ', ongoing? ' + books[i].ongoing + '.';
        //     list.push(item);
        // }
        // display.renderList(list);
    };

    this.manga = function () {
        console.log('flyleaf.js:: all manga');
        var mangaNodeList = [];

        // TODO return manga in alphabetical order
        // TODO make a manga query abstraction data.getBooks(map/reduce query)

        for (var i = _manga.length - 1; i >= 0; i--) {

            var item = document.createElement('li');
            var book = _manga[i].doc;
            item.innerHTML = 'Title: ' + book.title + ' Hits: ' + book.hits;  
            
            mangaNodeList.push(item);
        }
        display.renderList(mangaNodeList);
    };

    this.settings = function () {
        console.log('settings');
    };

    this.aboutUs = function () {
        console.log('About us');
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