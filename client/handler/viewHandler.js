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
        
        var mangaID = context.params.id;
        view.manga.init();
        data.manga.get(mangaID, function (err, manga) {
            
            if (err) return view.error(err); 
            view.navbar.setTitle(manga.title);
            
            
        });
        
        
    },
    
    
    chapter: function (context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('Chapter');
        view.chapter.init();
    }
};


module.exports = ViewHandler;