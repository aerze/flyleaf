'use strict';

var MangaEden = function() {
    var netto = new Netto();
    var parse = function(data) {
        return JSON.parse(JSON.parse(data));
    };

    
    this.search = function(name) {
        console.log(this);
    };

    // TODO: look into removeing proxy
    this.getList = function(page, pageSize, callback) {
        page = page || 0;
        pageSize = pageSize || 16000;
        var path = 'http://www.mangaeden.com/api/list/0/?p=' + page + '&l='+pageSize;
        netto.get(path, function(data) {
            var list = parse(data);
            console.log('mangaEden.js:: Got List: ' + list.start + '-' + list.end);
            callback(list);
        });
    };

    this.getListAll = function(callback) {
        var path = 'http://www.mangaeden.com/api/list/0/';
        netto.get(path, function(data) {
            var list = JSON.parse(data);
            
            console.log('mangaEden.js:: Got List: ' + list.start + '-' + list.end);

            var manga = [];
            for (var i = 0; i <= list.manga.length - 1; i+=1) {
                manga.push({
                   title: list.manga[i].t,
                   alias: list.manga[i].a,
                   genre: list.manga[i].c,
                   hits: list.manga[i].h,
                   mangaEdenID: list.manga[i].i,
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
        netto.proxy(path, function(data) {
            var manga = parse(data);
            console.log('mangaEden.js:: Got Manga: ' + manga.title);
            callback(manga);
        });
    };

    this.getChapter = function(chapterId, callback) {
        if (chapterId === undefined) return 'ERROR:: no chapterId';

        var path = 'http://www.mangaeden.com/api/chapter/'+ chapterId +'/';
        netto.proxy(path, function(data) {
            var chapter = parse(data);
            var pageLinks = [];
            console.log('mangaEden.js:: Got Pages: ' + chapter.images.length);
            for (var i = 0; i < chapter.images.length; i++) {
                pageLinks.push('https://cdn.mangaeden.com/mangasimg/' + chapter.images[i][1]); 
            }
            callback(pageLinks);
        });
    };
};


console.log('mangaEden.js:: loaded');