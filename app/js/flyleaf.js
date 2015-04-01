/*global Display, Data, page, console*/
'use strict';

var Flyleaf = function() {
    var data = new Data();
    this.data = data;

    var display = new Display(data);
    
    var _dbInfo = {};
    var _initalLoad = false;
    
    // Runs on every page change
    this.init = function (context, next) {
        if (_initalLoad) { 
            console.log('Pouch is already connected.');
            next();
        } else {
            console.log('initializing *bbbzzzpptt*');
            console.log('connecting to pouchDB');
            data.connect();

            data.getDBInfo(function (err, dbInfo) {
                _dbInfo = dbInfo;
                _initalLoad = true;
                next();
            });
        }
    };

    this.home = function () {
            page('/myBooks');
    };

    this.myBooks = function () {
        if (data._dbInfo.myBooks.doc_count > 0) {
            display.mangaList('myBooks', function() {
                
            });
        } else {
            display.error('No Books saved!<br/>Go to the search page to find some.'); 
        }
    };

    this.search = function() {
            if (data._dbInfo.books.doc_count > 0) {
                display.search('books', function() {

                });
            } else {
                display.error('No Manga found, I have no idea what happened.');
            }
    };

    this.settings = function () {
        display.renderString('Nothing here yet');
    };

    this.aboutUs = function () {
        display.renderString('Twitter: @mythrilco<br/>Weekend Hacker: @aerze @jenniration @nkhilv');
    };

    this.manga = function (req) {
        data.getMangaInfo(req.params.id, function (mangaInfo) {
            display.manga(mangaInfo);
        });
    };

    this.chapter = function (req) {
        data.getChapterInfo(req.params.id, function (chapterInfo) {
            display.chapter(chapterInfo);
        });
    };

    // this._sortByHits = function(mangaArray) {
    //     var sorted = [];
    //     sorted = mangaArray.sort(function (a, b) {
    //         return a.doc.hits - b.doc.hits;
    //     });
    //     return sorted;
    // };
};