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
    
    
    search: function() {
        view.navbar.setType('menu');
        view.navbar.setTitle('Search');
        view.search.init();
    },
    
    
    settings: function () {
        view.navbar.setType('menu');
        view.navbar.setTitle('Settings');
        view.settings.init();
    },
    
    
    account: function () {
        view.navbar.setType('menu');
        view.navbar.setTitle('My Account');
        view.account.init();
    },
    
    
    about: function () {
        view.navbar.setType('menu');
        view.navbar.setTitle('About Us');
        view.about.init();
    }
};


module.exports = ViewHandler;