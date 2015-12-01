'use strict';

var ForerunnerDB = require('forerunnerdb');
var fdb = new ForerunnerDB();
var db = fdb.db('flyleafco');

var Data = {
    
    init: function () {
        this.library.db = db.collection('library');
        // this.cache = fdb.collection('cache');
        // this.info = fdb.collection('info');
    },
    
    library: {
        init: function (callback) {
            var library = this.db;
            
            library.load(function (err) {
                if (err) callback(err, null);
                else callback(null, {length: library.count()});
            });
        }
        
        
    },
    
    manga: {
        get: function (id, callback) {
            
            if (!id || id === '123') callback(new Error('MangaID Missing'), null);
            else callback(null, {id: id});
            
        }
    }
}


module.exports = Data;