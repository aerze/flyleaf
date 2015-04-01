'use strict';

var MangaEden = function() {
    var net = Object.create(Net);

    this.getListAll = function(callback) {
        var path = 'http://www.mangaeden.com/api/list/0/';
        net.get(path, function(data) {
            var list = JSON.parse(data);
            
            console.log('mangaEden.js:: Got List: ' + list.start + '-' + list.end);

            var manga = [];
            for (var i = 0; i <= list.manga.length - 1; i+=1) {
                manga.push({
                   title: list.manga[i].t,
                   alias: list.manga[i].a,
                   genre: list.manga[i].c,
                   hits: list.manga[i].h,
                   _id: list.manga[i].i,
                   coverImage: list.manga[i].im,
                   lastChapterDate: list.manga[i].ld,
                   status: list.manga[i].s
                });
            }
            list.manga = null;
            callback(manga, list.total);
        });
    };

    this.getManga = function(mangaId, callback) {
        if (mangaId === undefined) return 'ERROR:: no mangaId';

        var path = 'http://www.mangaeden.com/api/manga/'+ mangaId +'/';
        net.get(path, function(data) {
            var manga = JSON.parse(data);
            console.log('mangaEden.js:: Got Manga: ' + manga.title);
            callback(manga);
        });
    };

    this.getChapter = function(chapterId, callback) {
        if (chapterId === undefined) return 'ERROR:: no chapterId';

        var path = 'http://www.mangaeden.com/api/chapter/'+ chapterId +'/';
        net.get(path, function(data) {
            var chapter = JSON.parse(data);
            callback(chapter);
        });
    };
};