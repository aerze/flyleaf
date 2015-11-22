'use strict';

var view = require('../lib/view');

var ViewHandler = {
    
    init: function (context, next) {
        
        if (context.init) view.init();
        next();
        
    },
    
    
    library: function(context, next) {
        view.navbar.setType('menu');
        view.navbar.setTitle('Library');
        view.library.init();
    }
};


module.exports = ViewHandler;