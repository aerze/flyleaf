'use strict';

var view = require('../lib/view');
var data = require('../lib/data');

var ViewHandler = {

    init: function (context, next) {

        if (context.init) view.init();
        context.state.init = {};
        context.state.init.view = true;
        context.save();

        next();

    },


    library: function(context, next) {

        view.navbar.setType('menu');
        view.navbar.setTitle('Library');
        view.library.init();
        if (context.state.libraryCount > 0 ) view.library.update(data.library.db.find());
        else view.library.empty();
    },


    search: function(context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('Search');
        view.search.init();

        if (context.state.genres) view.search.genres(context.state.genres);

        var handleSearch = function (event) {
            event.preventDefault();
            var genreID, genre, i;

            //close options
            $('.collapsible-header.active').trigger('click.collapse');

            var $genreInputs = $('.genres input');

            // set some defaults
            var options = {
                all: null,
                end: null,
                start: null,
                sort: 'pop',
                genres: {good: [], bad: []},
                string: $('#search').val()
            };

            // check for genres
            for (i = $genreInputs.length -1; i >= 0; i-=1) {
                genre = $genreInputs[i];
                genreID = genre.id.substr(1, genre.id.length);
                if (genre.checked) options.genres.good.push(genreID);
                else options.genres.bad.push(genreID);
            }

            if (options.string === '' && options.genres.good.length === 0) {

                data.search.top(function (err, docs) {

                    if (err) return view.error(err);
                    view.search.updateList(docs);

                });

            } else {

                //return all matching mangas, no pagination
                options.all = true;

                data.search.run(options, function (err, docs) {

                    if (err) return view.error(err);
                    view.search.updateList(docs);

                });
            }
        };


        // set triggers for search
        // on input, but more than 2 chars
        $('.input-field').on('input', function (event) {
            if ($('#search').val().length < 2) {
                event.preventDefault();
                return;
            } else {
                handleSearch();
            }
        });

        // on form button
        $('.form-button').on('click', handleSearch);

        // on form submit (covers iOS not respecting preventDefault)
        $('form').on('submit', handleSearch);

        $('form').submit();
    },


    settings: function (context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('Settings');
        view.settings.init();
    },


    account: function (context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('My Account');
        view.account.init();
    },


    about: function (context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('About Us');
        view.about.init();
    },


    manga: function (context, next) {

        view.navbar.setType('menu');
        view.navbar.setTitle('Manga');


        var manga = context.state.manga;

        view.manga.init(manga);
        view.navbar.setTitle(manga.title);




    },


    chapter: function (context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('Chapter');

        var chapter = context.state.chapter;

        view.chapter.init(chapter.images);
    }
};


module.exports = ViewHandler;