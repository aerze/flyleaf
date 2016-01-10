'use strict';

var data = require('../lib/data');

var DataHandler = {

    init: function (context, next) {

        if (context.init) data.init();
        context.state.init.data = true;
        context.save();

        next();

    },

    library: function (context, next) {

        data.library.init(function (err, lib) {

            if (err) console.error(err);
            else {
                context.state.libraryCount = data.library.db.count();
                console.log('DATA:: library loaded: ' + data.library.db.count());
            }
            context.save();
            next();

        });

    },


    search: function (context, next) {

        data.search.getGenres(function (err, data) {

            if (err) console.error(err);
            else context.state.genres = data;

            context.save();
            next();

        });
    },

    manga: function (context, next) {

        var mangaID = context.params.id;

        data.manga.get(mangaID, function (err, mangaData) {

            if (err) console.error(err);
            else context.state.manga = mangaData;

            context.save();
            next();

        });
    },

    chapter: function (context, next) {

        var chapterID = context.params.id;

        data.chapter.get(chapterID, function (err, chapterData) {

            if (err) console.err(err);
            else context.state.chapter = chapterData;

            context.save();
            next();

        });

    }
};

module.exports = DataHandler;