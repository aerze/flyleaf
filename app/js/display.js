 'use strict';
/* globals page, $, Materialize, Render*/
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
        var item = Render.li({
            classList: ['collection-item', 'avatar', 'waves-effect', 'waves-green'],
            id: manga._id,
            onclick: function () { page('/manga/' + this.id); }
        });

        var image = Render.img({
            classList: 'thumb-image',
            src: 'http://cdn.mangaeden.com/mangasimg/' + imageID,
            alt: manga.title
        });

        var title = Render.h6({
            classList: ['title', 'flow-text', 'truncate'],
            text: manga.title
        });

        item.add(image)
            .add(title);

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
        var main = Render.div();
        var listContainer = Render.ul({id: 'library', classList: 'collection'});
        var header = Render.div({classList: 'collection-header'})
                .add(Render.div({text:'My Library'}));

        main.add(header)
            .add(listContainer);

        this.renderNode(main);
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
        var formWrapper = Render.div({classList: 'form-wrapper'});
        var buttonGroup = Render.div({classList: 'button-group'});
        var collapsible = Render.ul({classList: 'collapsible', id: 'filter'})
            .set('data-collapsible', 'accordion');
        var inputField = Render.div({classList: 'input-field'});
        var listContainer = Render.ul({id: 'results', classList: 'collection'});
        var searchForm = Render.form().add(inputField);

        inputField
            .add(Render.input({id: 'search', type: 'text', required: true}))
            .add(Render.label({'for': 'search'})
                .add(Render.i({classList: 'mdi-action-search'})));

        collapsible
            .add(Render.li()
                .add(Render.div({classList: 'collapsible-header'})
                    .add(Render.i({classList: 'mdi-content-filter-list'}))
                    .add(Render.text('Filter')))
                .add(Render.div({classList: 'collapsible-body'})
                    .add(Render.p({text: 'this is a filter'}))))
            .add(Render.li()
                .add(Render.div({classList: 'collapsible-header'})
                    .add(Render.i({classList: 'mdi-content-sort'}))
                    .add(Render.text('Sort')))
                .add(Render.div({classList: 'collapsible-body'})
                    .add(Render.p()
                        .add(buttonGroup))));

        buttonGroup
            .add(Render.button({
                classList: ['waves-effect', 'waves-light', 'green', 'btn'], 
                innerHTML: 'POP &#x21F5'}))
            .add(Render.button({
                classList: ['waves-effect', 'waves-light', 'green', 'btn'], 
                innerHTML: 'A-Z &#x21F5'}));

        
        formWrapper
            .add(searchForm)
            .add(collapsible);

        Render.view(formWrapper);
        $('#filter').collapsible();

        var inputView = $('#search');
        var searchInput = function(event) {
            event.preventDefault();
            var searchString = inputView.val();
            console.log(searchString);
            if (searchString === '' || searchString.length <= 2) {
                if (this.lastRendered === 'default') return;
                renderList(data.top('catalog', 10), listContainer);
                this.lastRendered = 'default';
                // Materialize.showStaggeredList('#search');
            } else {
/*                 renderList(data.search('catalog', searchString), listContainer); */
                var search = {
                    string: searchString
                };
                
                data.searchF(search, function (data) {
                    renderList(data, listContainer);
                });
                this.lastRendered = listContainer;
            }
        };
/*         inputView.on('input', searchInput); */
        $(inputView).on('input', searchInput);
        $(searchForm).on('submit', searchInput);
        
        renderList(data.top('catalog', 10), listContainer);
        inputView.lastRendered = 'default';

        function renderList (docs, listContainer) {
            console.dir(docs);
            listContainer.innerHTML = '';

            for (var i = 0; i <= docs.length - 1; i++) {
                // var item = makeListItem(docs[i], docs[i].coverImage);
                // var item = makeListItem(docs[i], docs[i].coverImage);

                var item = Render.li({
                    classList: ['collection-item', 'waves-effect', 'waves-green'],
                    id: docs[i]._id,
                    onclick: click
                });
                item.add(Render.h6({
                    classList: ['title', 'flow-text', 'truncate'],
                    text: docs[i].title
                }));

/*                 item.style.opacity='0'; */
                listContainer.appendChild(item);
            }
            function click () { page('/manga/' + this.id); }
            Render.node(listContainer);
/*             Materialize.showStaggeredList('#results'); */
        }
    };





    this.manga = function(manga) {
        this.renderString('manga loaded');

        var main = Render.div();
        // start parallax

        var parallaxContainer = Render.div({classList: 'parallax-container'});
        var parallaxDiv = Render.div({classList: 'parallax'});
        var _image = Render.img({src: 'http://cdn.mangaeden.com/mangasimg/' + manga.image});

        parallaxContainer
            .add(parallaxDiv
                .add(_image));

        main.add(parallaxContainer);

        // end parallax
        // start section

        var sectionDiv = Render.div({classList: ['container', 'white']});

        sectionDiv
            .add(Render.h3({text: manga.title}))
            .add(Render.h5({text: 'Author: ' + manga.author}))
            .add(Render.h5({text: 'Artist: ' + manga.artist}));

        //  start button

        var _saveString = 'Save';
        var _saveIconString = 'mdi-action-favorite-outline';
        if (data.checkLibrary(manga._id)) {
            _saveString = 'Saved';
            _saveIconString = 'mdi-action-favorite';
        } 

        var _saveBook = Render.button({
            classList: ['waves-effect', 'green', 'waves-light', 'btn'],
            text: _saveString,
            onclick: function () {
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
            }
        });
        
        sectionDiv
            .add(_saveBook
                .add(Render.i({classList: [ _saveIconString, 'left' ]})));

        // End button
        

        // end section
        // start collapsible

        var collapsibleContainer = Render.ul({classList: 'collapsible'})
                .set('data-collapsible', 'accordion');


        var tagsCollapsibleHeader = Render.div({
            classList: ['collapsible-header', 'waves-effect', 'waves-green'],
            text: 'Tags'
        });
        var tagsCollapsibleBody = Render.div({classList: 'collapsible-body'});
        var _categories = Render.ul({classList: 'container'});
        for (var i = manga.categories.length - 1; i >= 0; i--) {
            _categories.add(Render.li({text:manga.categories[i]}));
        }
                
            
        collapsibleContainer
            .add(Render.li()
                .add(tagsCollapsibleHeader
                    .add(Render.i({classList: 'mdi-notification-more'})))
                .add(tagsCollapsibleBody
                    .add(_categories)));



        var summaryCollapsibleHeader = Render.div({
            classList: ['collapsible-header', 'waves-effect', 'waves-green'],
            text: 'Summary'
        });
        var summaryCollapsibleBody = Render.div({classList: 'collapsible-body'});
        var _description = Render.p({innerHTML: manga.description});

        collapsibleContainer
            .add(Render.li()
                .add(summaryCollapsibleHeader
                    .add(Render.i({classList: 'mdi-action-speaker-notes'})))
                .add(summaryCollapsibleBody
                    .add(_description)));


        var _chapters = Render.ul({classList: 'collection'});
            
        _chapters
            .add(Render.li({classList: 'collection-header'})
                .add(Render.h4({text: 'Chapters'})));

        for (var i = manga.chapters.length - 1; i >= 0; i--) {
            var label = (manga.chapters[i][2] === null || manga.chapters[i][2] === manga.chapters[i][0].toString()) ?
                'CH ' + manga.chapters[i][0] :
                'CH ' + manga.chapters[i][0] + ': ' + manga.chapters[i][2];

            var _chapterListItem = createElement('li');
            var _chapterDiv = document.createElement('div');
                _chapterDiv.appendChild(document.createTextNode(label));
            var _chapterA = document.createElement('a');
                _chapterA.classList.add('secondary-content');
            var _chapterIcon = document.createElement('i');

            if (manga.chapters[i][4] === undefined) {
                _chapterIcon.classList.add('mdi-action-bookmark-outline');
            } else if (parseInt(manga.chapters[i][4]) >= 0) {
                _chapterIcon.classList.add('mdi-action-bookmark');
            } else {
                _chapterIcon.classList.add('mdi-action-done');
            }
                _chapterA.appendChild(_chapterIcon);
                _chapterDiv.appendChild(_chapterA);
                _chapterListItem.appendChild(_chapterDiv);

            // var _chapterListItem = createElement('button', label);
                _chapterListItem.index = i;
                _chapterListItem.id = manga.chapters[i][3];
                _chapterListItem.onclick = loadChapter;
                _chapterListItem.classList.add('collection-item', 'waves-effect', 'waves-green');
                // _chapterListItem.classList.add('btn', 'btn-primary');
            _chapters.appendChild(_chapterListItem);
        }

        main
            .add(sectionDiv)
            .add(collapsibleContainer)
            .appendChild(_chapters);

        Render.view(main);

        $(document).ready(function(){
          $('.parallax').parallax();
          $('.collapsible').collapsible();
        });

        function loadChapter() {
            data.readChapter(manga._id, this.index, 0);
            flyleaf.setID('chapterIndex', this.index);
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

        var alreadyHit = false;
        $(window).scroll(function() {
            var pos = $(window).scrollTop() + $(window).height();
            var bottom = $(document).height() - 150;
            if (bottom < 1000) bottom = 1000;
            if( pos > bottom) {
                console.log('passed bottom');
                if (alreadyHit) return;
                alreadyHit = true;
                var mangaID = flyleaf.getID('mangaID');
                var chapterIndex = flyleaf.getID('chapterIndex');
                data.readChapter(mangaID, chapterIndex, true);
            }
        });

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