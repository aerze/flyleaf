/*global Display, Data, page, console*/
'use strict';

var Flyleaf = function() {
    var data = new Data();
    this.data = data;

    var display = new Display(data);
    this.display = display;

    var _initalLoad = false;

    // Runs on every page change
    this.init = function (context, next) {
        if (_initalLoad) {
            console.log('Flyleaf:: ' + context.path);
            next();
        } else {
            console.log('Flyleaf:: InitalLoad running');
            data.connect();

            data.loadDB(function (err, count) {
                display.reveal();
                next();
            });
        }
    };

    this.home = function () {
            page('/myBooks');
    };

    this.myBooks = function () {
        if (data.count('library') > 0) {
            display.library();
        } else {
            display.error('No Books saved!<br/>Go to the search page to find some.');
        }
    };

    this.search = function() {
        var renderList = display.search.renderList;
        var handleSearch = function (event) {

            event.preventDefault();
            var searchString = $('#search').val();
            console.log('Display:: searching: ' + searchString);

            if (searchString === '' || searchString.length <= 2) {
                if (this.lastRendered === 'default') return;

                this.lastRendered = 'default';
                data.top(10, function (docs) {
                    renderList(docs);
                });
            } else {
                if (this.lastRendered === searchString) return;
                var search = {string: searchString};
                var options = {all: true};
                this.lastRendered = searchString;
                data.searchF(search, options, function (docs) {
                    renderList(docs);
                });
            }
        };

        display.search.init(function () {
            $('.input-field').on('input', handleSearch);
            $('form').on('submit', handleSearch);
            $('form').submit();
        });
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