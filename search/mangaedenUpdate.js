'use strict'; 
/*jshint node:true*/

var Firebase = require('firebase');
var netto = require('netto');

var mangaedenRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden');
var mangaRef = mangaedenRef.child('manga');
var metaRef = mangaedenRef.child('meta');
var mangaedenPath = '/api/list/0/';
var genres = {};
netto.root = 'www.mangaeden.com';

var update = function () {
    metaRef.child('lastUpdate').once('value', function (snap) {
        var lastUpdate = new Date(snap.val());
        var now = new Date();
        
        if (now - lastUpdate >= 1000*60+60 ) {
            updateFirebase();
        }
    });
};
    
var updateFirebase = function () {
    
    console.log('Firebase Catalog Update: Started');
    netto.node('get', mangaedenPath, null, function (err, data) {
        if (err) {
            console.log('SOMTHING IS GOING ON HERE!');
            console.log(err);
        } else {
            data = JSON.parse(data);
            console.log('Firebase Catalog Update: ' + data.manga.length + ' books');
            var manga = {};
            var titles = {};
                for (var i = 0; i <= data.manga.length - 1; i+=1) {
                    manga[data.manga[i].i] = {
                       title: data.manga[i].t,
                       alias: data.manga[i].a,
                       genre: data.manga[i].c,
                       hits: data.manga[i].h,
                       _id: data.manga[i].i,
                       coverImage: data.manga[i].im,
                       lastChapterDate: data.manga[i].ld ||null,
                       status: data.manga[i].s
                    };
                    titles[data.manga[i].a.replace(/\./g, '')] = data.manga[i].t;
                    var genreObj = {};
                    for (var j = manga[data.manga[i].i].genre.length - 1; j >= 0; j--) {
                      if (!genres[ manga[data.manga[i].i].genre[j] ]) {
                        genres[ manga[data.manga[i].i].genre[j] ] = true;
                      }
                      genreObj[manga[data.manga[i].i].genre[j]] = true;
                    }
                    manga[data.manga[i].i].genre = genreObj;
                }

            data.manga = null;
            delete data.manga;

            mangaRef.set(manga);
            metaRef.child('titles').set(titles);
            metaRef.child('length').set(parseInt(data.total));
            metaRef.child('genres').set(genres);
            metaRef.child('sorts').set({'hits': true});
            
            var now = new Date();
            console.log('Firebase Catalog Update:' + now);
            metaRef.child('lastUpdate').set(now.toISOString());
            console.log('Firebase Catalog Update: Complete');
        }
    });
};

module.exports = update;