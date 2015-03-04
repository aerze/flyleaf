'use strict';
/*global page */

var Flyleaf = function() {
    var display = Object.create(Display);
    var data = new Data();

    var dbInfo = {};
    var _manga = [];

    var loadManga = function(callback) {
        console.log('Flyleaf :: loading Manga');
        data.storeAllManga();
        data.getAllManga(function (manga) {
            _manga = manga;
            // manga = null; //TODO research if making this null helps release the variable.
            callback();
        });
    };

    this.init = function () {
        loadManga(function() {
            data.getDbs(function(info) {
                dbInfo = info;

                if (dbInfo.myBooks.doc_count > 0) {
                    page('/myBooks');
                } else {
                    page('/manga');
                }
            });
        });
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