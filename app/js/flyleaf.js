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
            console.log('Flyleaf:: Initial Load');
            data.connect();
            data.loadDB(function (err, count) {
                _initalLoad = true;
                display.reveal();
                next();
            });
        }
    };





    this.home = function () {
            page('/myBooks');
    };





    this.myBooks = function () {
        display.setNavButton('menu');
        display.setNavTitle();
        display.initLibrary();

        data.getLibrary(function (err, lib) {
            if (lib.length < 1) {
                display.error('No Books saved!<br/>Go to the search page to find some.'); 
                return;
            }
            var $libraryList = $('#library'),
                item, i;

            for (i = 0; i <= lib.length - 1; i++) {
                item = display.makeListItem(lib[i], lib[i].image, true);    
                $libraryList.append(item);
            }

        });
    };





    this.search = function() {
        display.setNavButton('menu');
        display.setNavTitle();
        var renderList = display.search.renderList;

        var generateSearchHash = function (options) {
            var string = 'searching';
            if (options.string) string += ':' + options.string;
            if (options.genres.good.length > 0) {
                string += ':';
                for (var i = options.genres.good.length - 1; i >= 0; i--) {
                    string += '|' + options.genres.good[i];
                }
            }
            return string;
        };

        var handleSearch = function (event) {
            event.preventDefault();
            // close options boxes
            $('.collapsible-header.active').trigger('click.collapse');

            // get last request hash
            var lastRendered = $('form')[0].lastRendered;

            var genreInputs = $('.genres input');
            
            // set default search options
            var options = {
                all: null,
                end: null,
                start: null,
                sort: 'hits',
                genres: {good: [], bad: []},
                string: $('#search').val()
            };

            // check for any checked boxes
            for (var i = genreInputs.length - 1; i >= 0; i--) {
                var genre = genreInputs[i];
                if (genre.checked) options.genres.good.push(genre.id.substr(1, genre.id.length));
                else options.genres.bad.push(genre.id.substr(1, genre.id.length));
            }

            // Return if we just searched for these options
            if (lastRendered === generateSearchHash(options)) return;

            // if everything is default, just return the top 10 mangas
            if (options.string === '' && options.genres.good.length === 0) {
                $('form')[0].lastRendered = generateSearchHash(options);
                data.top(10, function (docs) {
                    renderList(docs);
                });
            } else {
                // return all the matching mangas
                options.all = true;

                // set the new hash, and log it to see the options used.
                var hash = generateSearchHash(options);
                $('form')[0].lastRendered = hash;
                console.log(hash);

                data.searchF(options, function (docs) {
                    console.log('Flyleaf:: rendering data');
                    renderList(docs);
                });
            }
        };

        display.search.init(function () {
            $('.input-field').on('input', function (event) {
                if ($('#search').val().length < 3) {
                    event.preventDefault();
                    return;
                } else handleSearch(event);
            });
            $('.form-button').on('click', handleSearch);
            $('form').on('submit', handleSearch);
            var prevSearch = flyleaf.getID('searchCache');
            if (prevSearch !== undefined) {
                renderList(prevSearch);
                console.log('Flyleaf:: rendering with prev data');
            } else $('form').submit();
        });
    };





    this.settings = function () {
        display.setNavButton('menu');
        display.setNavTitle();
        display.renderString('Nothing here yet');
    };





    this.myAccount = function () {
        display.setNavButton('menu');
        display.setNavTitle('My Account');
        display.renderString('TESTING');
    };





    this.aboutUs = function () {
        display.setNavButton('menu');
        display.setNavTitle();
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
        display.setNavButton('back');

        current.mangaID = req.params.id;
        data.getMangaInfo(req.params.id, function (err, mangaInfo) {
            setNavTitle(mangaInfo.title);
            if (err) display.error(err);
            else {
                display.manga(mangaInfo);
                display.setNavTitle(mangaInfo.title);
            }
        });
    };





    this.chapter = function (req) {
        display.setNavButton('back');
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