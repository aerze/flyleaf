'use strict';


/**
 * Interface for the MangaEden API. This standardizes the MangaEden API
 * for Flyleaf, in hopes to add new sources to match closely to this.
 * @constructor
 */
var MangaEden = function() {
	var mangaRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden/manga');
	var metaRef = new Firebase('https://flyleafco.firebaseio.com/catalog/mangaeden/meta');
    var net = Object.create(Net);


    /**
     * Downloads the complete list of manga available at MangaEden
     * @param  {Callback} callback callback(err, mangaList, totalManga)
     */
    this.getFullList = function(callback) {
		mangaRef.once('value', function (mangaSnap) {
			var manga = mangaSnap.val();
			var clean = [];
			for ( var key in manga) {
				if (manga.hasOwnProperty(key)) {
					clean.push(manga[key]);
				}
			}
			callback(null, clean, clean.length);
		}, function (err) {
			callback(err, null);
		});
    };
		
/*         console.log('MangaEden:: getting full list, this may take a while');
        var path = 'http://www.mangaeden.com/api/list/0/';
        net.get(path, function(err, data) {
            if (err) callback(err, null);
            var list = JSON.parse(data);
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
            callback(null, manga, list.total); 
        }); */

    /**
     * Downloads detailed manga information based on _id
     * @param  {string}   mangaId  _id of the manga
     * @param  {Callback} callback callback(err, [manga]{@link MangaDetailInfo})
     */
    this.getManga = function(mangaId, callback) {
        if (mangaId === undefined || typeof mangaId !== 'string') callback(new Error('ERROR:: mangaId invalid'), null);

        var path = 'http://www.mangaeden.com/api/manga/'+ mangaId +'/';
        net.get(path, function(err, data) {
            if (err) callback(err, null);
            var manga = JSON.parse(data);
            console.log('mangaEden.js:: Got Manga: ' + manga.title);
            callback(err, manga);
        });
    };


    /**
     * Downloads the list of images, places them into [ImageInfo]{@link ImageInfo} objects
     * @param  {string}   chapterId _id of the chapter
     * @param  {Callback} callback callback(err, [chapter]{@link ChapterImages})
     */
    this.getChapter = function(chapterId, callback) {
        if (chapterId === undefined || typeof chapterId !== 'string') callback(new Error('ERROR:: chapterId invalid'), null);

        var path = 'http://www.mangaeden.com/api/chapter/'+ chapterId +'/';
        net.get(path, function(err, data) {
            if (err) callback(err, null);
            var chapter = JSON.parse(data);
            callback(err, chapter);
        });
    };
};