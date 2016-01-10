'use strict'; 
/*jshint node:true*/

var Firebase = require('firebase');
var netto = require('netto');

var mangaedenRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden');
var mangaRef = mangaedenRef.child('manga');
var metaRef = mangaedenRef.child('meta');
var mangaedenPath = '/api/list/0/';
var genres = {};

netto.node('get', mangaedenPath, null, function (err, data) {
    if (err) {
        console.log('SOMTHING IS GOING ON HERE!');
        console.log(err);
    } else {
        data = JSON.parse(data);
        console.log(data.manga.length);
        var manga = {};
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

                var genreObj = {};
                console.log(manga[data.manga[i].i].genre.length);
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

        console.log(manga);
        console.log(data);

        mangaRef.set(null);
        mangaRef.set(manga);
        metaRef.set({
          length: parseInt(data.total),
          genres: genres
        });
        console.log(genres);


    }
});