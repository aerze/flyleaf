/*global Display, Data, page, console*/
'use strict';

var Flyleaf = function() {
    var data = new Data();
    this.data = data;

    var display = new Display(data);

    var _initalLoad = false;
    
    // Runs on every page change
    this.init = function (context, next) {
        $(window).scrollTop(0);
        if (_initalLoad) { 
            console.log('Forerunner:: already connected.');
            next();
        } else {
            console.log('Flyleaf:: initializing *bbbzzzpptt*');
            console.log('Forerunner:: connecting');
            data.connect();

            data.loadDB(function (err, count) {
                if (err) display.error(err.toString()); 
                else {
                    console.log('Forerunner:: \n\tmyBooks: ' + count.myBooks + '\n\tmanga: ' + count.manga);
                    data.indexCollection('catalog', function (err) {
                        if (err) console.log('Index creation failed, minor failure may impact catalog search times.');
                        _initalLoad = true;
                        next();
                    });
                }
            });
        }
    };

    this.home = function () {
            page('/myBooks');
    };

    this.myBooks = function (context) {
        console.log('Flyleaf:: at ' + context.path);
        if (data.count('library') > 0) {
            display.library();
        } else {
            display.error('No Books saved!<br/>Go to the search page to find some.'); 
        }
    };

    this.search = function() {
        var check = data.count('catalog');
            if (check > 0) {
                display.search();
            } else {
                console.log(check);
                display.error('No Manga found, I have no idea what happened.');
            }
    };

    this.settings = function () {
        display.renderString('Nothing here yet');
    };

    this.aboutUs = function () {
        display.renderString('Twitter: @mythrilco<br/>Weekend Hacker: @aerze @jenniration');
    };

    this.manga = function (req) {
        data.getMangaInfo(req.params.id, function (err, mangaInfo) {
            if (err) display.error(err);
            else display.manga(mangaInfo);
        });
    };

    this.chapter = function (req) {
        data.getChapterInfo(req.params.id, function (err, chapterInfo) {
            if (err) display.error(err);
            else display.chapter(chapterInfo);
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