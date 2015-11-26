'use strict';

var data = require('../lib/data');

var DataHandler = {
    
    init: function (context, next) {
        
        if (context.init) data.init();
        next();
        
    }
}

module.exports = DataHandler;