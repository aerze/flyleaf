'use strict';

var view = require('../lib/view');
var data = require('../lib/data');

var ViewHandler = {

    init: function (context, next) {

        if (context.init) view.init();
        next();

    },


    library: function() {
        view.navbar.setType('menu');
        view.navbar.setTitle('Library');
        view.library.init();

        data.library.load(function (err, lib) {
            if (lib.length < 1) {
                view.library.error('Error: No Books Saved');
                return;
            }
        });
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