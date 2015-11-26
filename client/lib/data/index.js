'use strict';

var ForerunnerDB = require('forerunnerdb');
var fdb = new ForerunnerDB();
var db = fdb.db('flyleafco');

var Data = {
    
    init: function () {
        this.library = db.collection('library');
        // this.cache = fdb.collection('cache');
        // this.info = fdb.collection('info');
        
        console.log('DATA:: db loaded');
    },
    
    library: {
        load: function (callback) {
            var library = this.library;
            
            library.load(function (err) {
                console.log('DATA:: library loaded: ' + library.count());
                if (err) callback(err, null);
                else callback(null, {length: library.count()});
            });
        }
    }
}


module.exports = Data;