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
        
    }
}

module.exports = DataHandler;