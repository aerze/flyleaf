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

        data.getLibrary(function (err, lib) {
            for (var i = 0; i <= lib.length - 1; i++) {
                var item = makeListItem(lib[i], lib[i].image, true);
                item.style.opacity='0';
                listContainer.appendChild(item);
            }
        });

        this.renderNode(main);
        Materialize.showStaggeredList('#library');
    };




    this.search = function () {
        // add search filter
        // display list after each filter change
        var navWrapper = Render.div({classList: 'nav-wrapper'});
        var buttonGroup = Render.div({classList: 'button-group'});
        var collapsible = Render.ul({classList: 'collapsible', id: 'filter'})
            .set('data-collapsible', 'accordion');
        var inputField = Render.div({classList: 'input-field'});
        var listContainer = Render.ul({id: 'results', classList: 'collection'});


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

        navWrapper
            .add(Render.form().add(inputField))
            .add(collapsible);

        Render.view(navWrapper);
        $('#filter').collapsible();

        var inputView = $('#search');
        inputView.on('input', function(event) {
            var searchString = event.target.value;
            if (searchString === '' || searchString.length <= 2) {
                if (this.lastRendered === 'default') return;
                renderList(data.top('catalog', 10), listContainer);
                this.lastRendered = 'default';
                // Materialize.showStaggeredList('#search');
            } else {
                renderList(data.search('catalog', searchString), listContainer);
                this.lastRendered = listContainer;
            }

        });

        renderList(data.top('catalog', 10), listContainer);
        inputView.lastRendered = 'default';

        function renderList (docs, listContainer) {
            console.dir(docs);
            listContainer.innerHTML = '';

            for (var i = 0; i <= docs.length - 1; i++) {
                var item = makeListItem(docs[i], docs[i].coverImage);
                item.style.opacity='0';
                listContainer.appendChild(item);
            }

            Render.node(listContainer);
            Materialize.showStaggeredList('#results');
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
            _description.innerHTML = manga.description;
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
        //   <li class="collection-item">
        //     <div>Alvin
        //       <a href="#!" class="secondary-content">
        //         <i class="mdi-content-send"></i>
        //       </a>
        //     </div></li>
        //   <li class="collection-item">Alvin</li>
        //   <li class="collection-item">Alvin</li>
        //   <li class="collection-item">Alvin</li>
        // </ul>

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

        main.appendChild(collapsibleContainer);
        main.appendChild(_chapters);
        // chapterCollapsibleBody.appendChild(_chapters);

        this.renderNode(main);

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