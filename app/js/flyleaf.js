/*global Display, Data, page, console*/
'use strict';

var Flyleaf = function() {
    var data = new Data();
    this.data = data;

    var display = new Display(data);

    var _initalLoad = false;

    // Runs on every page change
    this.init = function (context, next) {
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
                        $('.cover').remove();
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
        var container = display.container();
        container.classList.add('section');
        container.add(display.textNode('This was made by '))
                 .add(display.link('https://twitter.com/MythrilCo', '@mythrilco'))
                 .add(document.createElement('br'))
                 .add(display.textNode('Tweet me if you have any issues.'))
                 .add(document.createElement('br'))
                 .add(display.textNode('If you know what Github is and have an account, you can report issues '))
                 .add(display.link('https://github.com/aerze/flyleaf/issues', 'here.'))
                 .add(document.createElement('br'))
                 .add(document.createElement('br'))
                 .add(display.textNode('Thanks for reading! :)'));

        display.renderNode(container);
    };

    this.manga = function (req) {
        current.mangaID = req.params.id;
        data.getMangaInfo(req.params.id, function (err, mangaInfo) {
            setNavTitle(mangaInfo.title);
            if (err) display.error(err);
            else display.manga(mangaInfo);
        });
    };

    this.chapter = function (req) {
        current.chapterID = req.params.id;
        data.getChapterInfo(req.params.id, function (err, chapterInfo) {
            if (err) display.error(err);
            else display.chapter(chapterInfo);
        });
    };

    var current = {
        mangaID: '',
        chapterID:'',
    };

    this.setID = function (key, value) {
        current[key] = value;
    };

    this.getID = function (key) {
        return current[key];
    };

    var setNavTitle = function (string) {
        var navTitle = document.querySelector('.nav-title');
        navTitle.textContent = string;
    };
    this.setNavTitle = setNavTitle;

    // this._sortByHits = function(mangaArray) {
    //     var sorted = [];
    //     sorted = mangaArray.sort(function (a, b) {
    //         return a.doc.hits - b.doc.hits;
    //     });
    //     return sorted;
    // };
};