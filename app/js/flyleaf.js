'use strict';
/*global page */

var Flyleaf = function() {
    var display = Object.create(Display);
    var data = new Data();

    var dbInfo = {};
    this.init = function () {
        data.storeAllManga();
        data.getDbs(function(info) {
            dbInfo = info;

            if (dbInfo.myBooks.doc_count > 0) {
                page('/myBooks');
            } else {
                page('/manga');
            }
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
        console.log('manga');
        data.getAllManga(function (manga) {
            // TODO return manga in alphabetical order
            // TODO make a manga query abstraction data.getBooks(map/reduce query)
            console.log('flyleaf.js:: all manga');
            var mangaList = [];
            for (var i = manga.length - 1; i >= 0; i--) {

                var item = document.createElement('li');
                var book = manga[i].doc;
                item.innerHTML = 'Title: ' + book.title + ' Hits: ' + book.hits;  
                
                mangaList.push(item);
            }
            display.renderList(mangaList);
        });
        // display.manga();
    };

    this.settings = function () {
        console.log('settings');
    };

    this.aboutUs = function () {
        console.log('About us');
    };
};