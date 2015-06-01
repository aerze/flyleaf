'use strict';
/* globals page, $, Materialize*/
var Display = function(data) {
    this.container = function () {
        var container = document.createElement('div');
            container.classList.add('container');
            container.add = function(node) {
                container.appendChild(node);
                return container;
            };
            return container;
    };
    this.textNode = function (string) {
        return document.createTextNode(string);
    };
    this.link = function (href, text) {
        var link = document.createElement('a');
            link.setAttribute('href', href);
            link.appendChild(this.textNode(text));
        return link;
    };

    var makeListItem = function (manga, imageID, detail) {
        var item = document.createElement('li');
            item.classList.add('collection-item', 'avatar', 'waves-effect', 'waves-green');
            item.id = manga._id;
            item.onclick = function () { page('/manga/' + this.id); };

        var image = document.createElement('img');
            image.src = 'http://cdn.mangaeden.com/mangasimg/' + imageID;
            image.alt = manga.title;
            image.classList.add('thumb-image');
        item.appendChild(image);

        var title = document.createElement('h6');
            title.classList.add('title', 'flow-text', 'truncate');
            title.textContent = manga.title;
        item.appendChild(title);

        if (detail) {
            var details = document.createElement('p');
                details.classList.add('flow-text');
                details.innerHTML  = 'Author: ' + manga.author + '<br>' +
                // 'Artist: ' + manga.artist + '<br>' +
                'Latest Chapter: ' + manga.chapters_len;
            item.appendChild(details);
        }

        return item;
    };

    var makeListHeader = function (headerText) {
        var header = document.createElement('div');
            header.classList.add('collection-header');

        var div = document.createElement('div');
            div.textContent = headerText;

        header.appendChild(div);
        return header;
    };

    this.data = data;   
    this.mainView = document.querySelector('.main-view');

    this.renderString = function (string) {
        $(window).scrollTop(0);
        this.mainView.innerHTML = string;
    };

    this.renderNode = function (node) {
        this.mainView.innerHTML = '';
        $(window).scrollTop(0);
        this.mainView.appendChild(node);
    };

    this.library = function () {
        var main = document.createElement('div');
        var listContainer = document.createElement('ul');
            listContainer.id = 'library';
            listContainer.classList.add('collection');
        this.renderNode(main);

        var header = makeListHeader('My Library');
        main.appendChild(header);
        main.appendChild(listContainer);

        data.getLibrary(function (err, lib) {
            for (var i = 0; i <= lib.length - 1; i++) {
                var item = makeListItem(lib[i], lib[i].image, true);
                item.style.opacity='0';
                listContainer.appendChild(item);
            }
        });

        Materialize.showStaggeredList('#library');
    };

    this.search = function () {
        // add search filter
        // display list after each filter change

        this.renderString('<div class="nav-wrapper"><form><div class="input-field"><input id="search" type="text" required><label for="search"><i class="mdi-action-search"></i></label></div></form><div class="button-group"><button class="waves-effect waves-light green btn"> POP &#x21F5 </button><button class="waves-effect waves-light green btn"> A-Z &#x21F5 </button></div></div><div class="sub-view"></div>');
        
        var inputView = $('#search');
        var subView = $('.sub-view');
        inputView.on('input', function(event) {
            console.log(this);
            var searchString = event.target.value;
            if (searchString === '' || searchString.length <= 2) {
                if (this.lastRendered === 'default') return;
                renderList(data.top('catalog', 10), subView[0]);
                this.lastRendered = 'default';
            } else {
                renderList(data.search('catalog', searchString), subView[0]);
                this.lastRendered = searchString;
            }

        });

        renderList(data.top('catalog', 10), subView[0]);
        inputView.lastRendered = 'default';

        function renderList (docs, view) {
            view.innerHTML = '';
            
            console.log(docs);

            var listContainer = document.createElement('ul');
            for (var i = 0; i <= docs.length - 1; i++) {
                var item = makeListItem(docs[i], docs[i].coverImage);
                listContainer.appendChild(item);
            }
            view.appendChild(listContainer);
        }
    };

    this.manga = function(manga) {
        this.renderString('manga loaded');
        var main = document.createElement('div');

        // start parallax

        var parallaxContainer = document.createElement('div');
            parallaxContainer.classList.add('parallax-container');

        var parallaxDiv = document.createElement('div');
            parallaxDiv.classList.add('parallax');

        var _image = document.createElement('img');
            _image.src = 'http://cdn.mangaeden.com/mangasimg/' + manga.image;

        parallaxDiv.appendChild(_image);
        parallaxContainer.appendChild(parallaxDiv);
        main.appendChild(parallaxContainer);

        // end parallax
        // start section

        var sectionDiv = document.createElement('div');
            sectionDiv.classList.add('container', 'white');

        var _title = createElement('h3', manga.title);
        sectionDiv.appendChild(_title);

        var _author = createElement('h5', 'Author: ' + manga.author);
        sectionDiv.appendChild(_author);

        var _artist = createElement('h5', 'Artist: ' + manga.artist);
        sectionDiv.appendChild(_artist);
        
        //  start button

        var _saveString = '';
        var _saveIconString = '';
        if (data.checkLibrary(manga._id)) {
            _saveString = 'Saved';
            _saveIconString = 'mdi-action-favorite';
        } else {
            _saveString = 'Save';
            _saveIconString = 'mdi-action-favorite-outline';
        }
        var _saveBook = createElement('button', _saveString);
            _saveBook.classList.add('waves-effect', 'green', 'waves-light', 'btn');
        var _saveIcon = createElement('i');
            _saveIcon.classList.add(_saveIconString, 'left');
            _saveBook.appendChild(_saveIcon);
            _saveBook.onclick = function () {
                var text = this.textContent;
                if (data.checkLibrary(manga._id)) {
                    // _saveBook.textContent = 'Already Saved!';
                } else {
                    data.saveBook(manga, function (err) {
                        if (err) text = 'ERROR: Could Not Save';
                        else text = 'Saved!';
                        _saveBook.textContent = text;
                    });
                }
            };
        sectionDiv.appendChild(_saveBook);

        // End button
        main.appendChild(sectionDiv);

        // end section
        // start collapsible

        // <ul class="collapsible" data-collapsible="accordion">
        //   <li>
        //     <div class="collapsible-header"><i class="mdi-image-filter-drama"></i>First</div>
        //     <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
        //   </li>
        //   <li>
        //     <div class="collapsible-header"><i class="mdi-maps-place"></i>Second</div>
        //     <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
        //   </li>
        //   <li>
        //     <div class="collapsible-header"><i class="mdi-social-whatshot"></i>Third</div>
        //     <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
        //   </li>
        // </ul>
        
        var collapsibleContainer = document.createElement('ul');
            collapsibleContainer.classList.add('collapsible');
            collapsibleContainer.setAttribute('data-collapsible', 'accordion');

        var tagsCollapsibleContainer = document.createElement('li');
            
        var tagsCollapsibleHeader = document.createElement('div');
            tagsCollapsibleHeader.classList.add('collapsible-header', 'waves-effect', 'waves-green');
            tagsCollapsibleHeader.textContent = 'Tags';
        
        var tagsCollapsibleHeaderIcon = document.createElement('i');
            tagsCollapsibleHeaderIcon.classList.add('mdi-notification-more');
            // tagsCollapsibleHeaderIcon.classList.add('mdi-action-label-outline');
        
        var tagsCollapsibleBody = document.createElement('div');
            tagsCollapsibleBody.classList.add('collapsible-body');

            tagsCollapsibleHeader.appendChild(tagsCollapsibleHeaderIcon);
            tagsCollapsibleContainer.appendChild(tagsCollapsibleHeader);
            tagsCollapsibleContainer.appendChild(tagsCollapsibleBody);
            collapsibleContainer.appendChild(tagsCollapsibleContainer);

        var _categories = document.createElement('ul');
            _categories.classList.add('container');
            _categories.innerHTML = '<li>' + manga.categories.join('</li><li>') + '</li>';
        tagsCollapsibleBody.appendChild(_categories);



        var summaryCollapsibleContainer = document.createElement('li');
            
        var summaryCollapsibleHeader = document.createElement('div');
            summaryCollapsibleHeader.classList.add('collapsible-header', 'waves-effect', 'waves-green');
            summaryCollapsibleHeader.textContent = 'Summary';
        
        var summaryCollapsibleHeaderIcon = document.createElement('i');
            summaryCollapsibleHeaderIcon.classList.add('mdi-action-speaker-notes');
        
        var summaryCollapsibleBody = document.createElement('div');
            summaryCollapsibleBody.classList.add('collapsible-body');

            summaryCollapsibleHeader.appendChild(summaryCollapsibleHeaderIcon);
            summaryCollapsibleContainer.appendChild(summaryCollapsibleHeader);
            summaryCollapsibleContainer.appendChild(summaryCollapsibleBody);
            collapsibleContainer.appendChild(summaryCollapsibleContainer);

        var _description = createElement('p', manga.description);
        summaryCollapsibleBody.appendChild(_description);



        var chapterCollapsibleContainer = document.createElement('li');
            
        var chapterCollapsibleHeader = document.createElement('div');
            chapterCollapsibleHeader.classList.add('collapsible-header');
            chapterCollapsibleHeader.textContent = 'Chapter';
        
        var chapterCollapsibleHeaderIcon = document.createElement('i');
            chapterCollapsibleHeaderIcon.classList.add('mdi-action-list');
        
        var chapterCollapsibleBody = document.createElement('div');
            chapterCollapsibleBody.classList.add('collapsible-body');

            chapterCollapsibleHeader.appendChild(chapterCollapsibleHeaderIcon);
            chapterCollapsibleContainer.appendChild(chapterCollapsibleHeader);
            chapterCollapsibleContainer.appendChild(chapterCollapsibleBody);
            // collapsibleContainer.appendChild(chapterCollapsibleContainer);

        var _chapters = document.createElement('ul');
            _chapters.classList.add('collection');
        var _chaptersHeader = document.createElement('li');
            _chaptersHeader.classList.add('collection-header');

        var _chaptersH4 = createElement('h5', 'Chapters');
        _chaptersHeader.appendChild(_chaptersH4);
        _chapters.appendChild(_chaptersHeader);


        // <ul class="collection">
        //   <li class="collection-item">Alvin</li>
        //   <li class="collection-item">Alvin</li>
        //   <li class="collection-item">Alvin</li>
        //   <li class="collection-item">Alvin</li>
        // </ul>
            
        for (var i = manga.chapters.length - 1; i >= 0; i--) {
            var label = (manga.chapters[i][2] === null || manga.chapters[i][2] === manga.chapters[i][0].toString()) ?
                'CH ' + manga.chapters[i][0] :
                'CH ' + manga.chapters[i][0] + ': ' + manga.chapters[i][2];
            var _chapterButton = createElement('li', label);
            // var _chapterButton = createElement('button', label);
                _chapterButton.id = manga.chapters[i][3];
                _chapterButton.onclick = loadChapter;
                _chapterButton.classList.add('collection-item', 'waves-effect', 'waves-green');
                // _chapterButton.classList.add('btn', 'btn-primary');
            _chapters.appendChild(_chapterButton);
        }

        main.appendChild(collapsibleContainer);
        main.appendChild(_chapters);
        // chapterCollapsibleBody.appendChild(_chapters);

        this.renderNode(main);

        $(document).ready(function(){
          $('.parallax').parallax();
          $('.collapsible').collapsible();
        });

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
            images += '<img class="responsive-img" src="http://cdn.mangaeden.com/mangasimg/' + chapterInfo.images[i][1] + '"></img><br>';
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