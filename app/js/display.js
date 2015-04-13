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

    this.library = function () {
        var main = document.createElement('ul');
            main.classList.add('collection');
        this.renderNode(main);

        data.getLibrary(function (err, lib) {
            for (var i = 0; i <= lib.length - 1; i++) {
                var item = makeBook(lib[i]);
                main.appendChild(item);
            }
        });


        function makeBook(manga) {
            // console.log(manga);
            var item = document.createElement('li');
            item.classList.add('collection-item','avatar');
            item.id = manga._id;
            item.onclick = function () { page('/manga/' + this.id); };

            var image = document.createElement('img');
                image.src = 'https://cdn.mangaeden.com/mangasimg/' + manga.image;
                image.alt = manga.title;
                image.classList.add('thumb-image');
            item.appendChild(image);

            var title = document.createElement('h6');
                title.classList.add('title', 'flow-text');
                title.textContent = manga.title;
            item.appendChild(title);

            var details = document.createElement('p');
                details.innerHTML  = 'Author: ' + manga.author + '<br>' +
                // 'Artist: ' + manga.artist + '<br>' +
                'Latest Chapter: ' + manga.chapters_len;
            item.appendChild(details);

            return item;
        }
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
                renderList(data.top('catalog', 25), subView[0]);                
            } else {
                renderList(data.search('catalog', searchString), subView[0]);
            }
        });

        renderList(data.top('catalog', 50), subView[0]);

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

        var _image = document.createElement('img');
            _image.src = 'https://cdn.mangaeden.com/mangasimg/' + manga.image;
        main.appendChild(_image);

        var _title = createElement('h3', manga.title);
        main.appendChild(_title);

        var _saveString = (data.checkLibrary(manga._id)) ? 
            'Already Saved.' :
            'Save to Library';
        var _saveBook = createElement('button', _saveString);
            _saveBook.onclick = function () {
                var text = this.textContent;
                if (data.checkLibrary(manga._id)) {
                    _saveBook.textContent = 'Already Saved!';
                } else {
                    data.saveBook(manga, function (err) {
                        if (err) text = 'ERROR: Could Not Save';
                        else text = 'Saved!';
                        _saveBook.textContent = text;
                    });
                }
            };
        main.appendChild(_saveBook);

        var _author = createElement('h5', 'Author: ' + manga.author);
        main.appendChild(_author);


        var _artist = createElement('h5', 'Artist: ' + manga.artist);
        main.appendChild(_artist);


        var _categories = document.createElement('ul');
            _categories.innerHTML = '<li>' + manga.categories.join('</li><li>') + '</li>';
        main.appendChild(_categories);

        var _description = createElement('p', manga.description);
        main.appendChild(_description);


        var _chapters = document.createElement('ul');
        var _chaptersHead = createElement('h5', 'Chapters');
        _chapters.appendChild(_chaptersHead);


        for (var i = manga.chapters.length - 1; i >= 0; i--) {
            var label = (manga.chapters[i][2] === null || manga.chapters[i][2] === manga.chapters[i][0].toString()) ?
                'CH ' + manga.chapters[i][0] :
                'CH ' + manga.chapters[i][0] + ': ' + manga.chapters[i][2];
            var _chapterButton = createElement('li', label);
                _chapterButton.id = manga.chapters[i][3];
                _chapterButton.onclick = loadChapter;
            _chapters.appendChild(_chapterButton);
        }

        main.appendChild(_chapters);
        this.renderNode(main);

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