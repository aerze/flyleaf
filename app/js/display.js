'use strict';

var Display = function(data) {
    this.data = data;   
    this.mainView = document.querySelector('.main-view');

    this.renderString = function (string) {
        this.mainView.innerHTML = string;
    };

    this.renderNode = function (node) {
        this.mainView.innerHTML = '';
        this.mainView.appendChild(node);
    };

    this.search = function () {
        // add search filter
        // display list after each filter change

        this.renderString('<div class="nav-wrapper"><form><div class="input-field"><input id="search" type="text" required><label for="search"><i class="mdi-action-search"></i></label></div></form><div class="button-group"><button class="waves-effect waves-light green btn"> POP &#x21F5 </button><button class="waves-effect waves-light green btn"> A-Z &#x21F5 </button></div></div><div class="sub-view"></div>');
        
        var inputView = $('#search');
        var subView = $('.sub-view');
        inputView.on('input', function(event) {
            var searchString = event.target.value;
            if (searchString === '') {
                renderList(data.top(25), subView[0]);                
            } else {
                renderList(data.search(searchString), subView[0]);
            }
        });

        renderList(data.top(50), subView[0]);

        function renderList (docs, view) {
            view.innerHTML = '';

            var listContainer = document.createElement('ul');
            for (var i = 0; i <= docs.length - 1; i++) {
                var item = new Item(docs[i]);
                listContainer.appendChild(item);
            }
            view.appendChild(listContainer);
        }

        function Item (doc) {
            var item = document.createElement('li');
            item.innerHTML = doc.title;
            item.id = doc._id;
            item.alias = doc.alias;
            item.onclick =  function() {
                page('/manga/' + this.id);
            };
            return item;
        }
    };

    this.manga = function(manga) {
        this.renderString('manga loaded');
        var main = document.createElement('div');
        // Maybe change to use document.createElement to prevent haivng to loop again though jQ
        var _image = document.createElement('img');
            _image.src = 'https://cdn.mangaeden.com/mangasimg/' + manga.image;
        main.appendChild(_image);
        // var image = '<img src="https://cdn.mangaeden.com/mangasimg/' + manga.image + '"></img>';

        var _title = createElement('h3', manga.title);
        main.appendChild(_title);
        // var title = '<h3>' + manga.title + '</h3>';

        var _author = createElement('h5', 'Author: ' + manga.author);
        main.appendChild(_author);        
        // var author = '<h5> Author: ' + manga.author + '</h5>';

        var _artist = createElement('h5', 'Artist: ' + manga.artist);
        main.appendChild(_artist);
        // var artist = '<h5> Artist: ' + manga.artist + '</h5>';

        var _categories = document.createElement('ul');
            _categories.innerHTML = '<li>' + manga.categories.join('</li><li>') + '</li>';
        main.appendChild(_categories);
        // var categories = '<ul><li>' + manga.categories.join('</li><li>') + '</li>';

        var _description = createElement('p', manga.description);
        main.appendChild(_description);
        // var description = '<p>' + manga.description + '</p>';

        var _chapters = document.createElement('ul');
        var _chaptersHead = createElement('h5', 'Chapters');
        _chapters.appendChild(_chaptersHead);
        // var chapters = '<ul> <h5>Chapters</h5>';

        for (var i = manga.chapters.length - 1; i >= 0; i--) {
            var label = (manga.chapters[i][2] === null || manga.chapters[i][2] === manga.chapters[i][0].toString()) ?
                'CH ' + manga.chapters[i][0] :
                'CH ' + manga.chapters[i][0] + ': ' + manga.chapters[i][2];
            // var li = document.createElement('li');
            // manga.chapters[i]
        }

        // for (var i = manga.chapters.length - 1; i >= 0; i--) {
        //     var label = (manga.chapters[i][2] === null || manga.chapters[i][2] === manga.chapters[i][0].toString()) ?
        //         'CH ' + manga.chapters[i][0] :
        //         'CH ' + manga.chapters[i][0] + ': ' + manga.chapters[i][2];
        //     chapters += '<li class="chapters waves-effect waves-light green btn" id="' + manga.chapters[i][3] + '">' + label + '</li><br/>';
        // }
        // chapters += '</ul>';

        // var view = image + title + author + artist + categories + description + chapters;
        // this.renderString(view);
        this.renderNode(main);
        // var chapterNodes = $('.chapters');
        // for (var j = chapterNodes.length - 1; j >= 0; j--) {
        //     chapterNodes[j].onclick = loadChapter;
        // }

        function loadChapter() {
            page('/chapter/' + this.id);
        }

        function createElement (elem, text) {
            var element = document.createElement(elem);
            element.textContent = text;

            return element;
        }
    };

    this.chapter = function(chapterInfo) {
        this.renderString('chapter loaded');
        var images = '';

        for (var i = chapterInfo.images.length - 1; i >= 0; i--) {
            images += '<img src="https://cdn.mangaeden.com/mangasimg/' + chapterInfo.images[i][1] + '"></img><br>';
        }
        this.renderString(images);
    };

    this.startLoading = function (caller, process) {
        var string = caller + ':: Loading > ' + process; 
        console.log(string);
        this.renderString(string);
    };
    this.endLoading = function (caller, process) {
        var string = caller + '::  Loaded < ' + process;
        console.log(string);
        this.renderString(string);
    };

    this.error = function (string) {
        this.renderString(string);
    };

};