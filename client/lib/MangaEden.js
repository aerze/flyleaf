'use strict';

var Firebase = require('firebase');
var net = require('./net.js');

var mangaRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden/manga');
var metaRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden/meta');

var MangaEden = {
    
    manga: function(mangaId, callback) {
        if (mangaId === undefined || typeof mangaId !== 'string') callback(new Error('ERROR:: mangaId invalid'), null);

        var path = 'http://www.mangaeden.com/api/manga/'+ mangaId +'/';
        net.get(path, function(err, data) {
            
            if (err) return callback(err, null);
            
            var manga = JSON.parse(data);
            console.log('mangaEden.js:: Got Manga: ' + manga.title);
            callback(err, manga);
        });
    }
    
};

module.exports = MangaEden;