'use strict';

var material = require('./material');
var page = require('page');

var View = {

    navbar: {},

    // Start navbar and side menu
    init: function (context, next) {

        // generate list items
        var makeListItems = function () {
            var library     = material.navListItem({iconClass: 'mdi-av-my-library-books', text: 'Library', href: '#!library'});
            var search      = material.navListItem({iconClass: 'mdi-action-search', text: 'Search', href: '#!search'});
            var settings    = material.navListItem({iconClass: 'mdi-action-settings', text: 'Settings', href: '#!settings'});
            var account     = material.navListItem({iconClass: 'mdi-action-account-box', text: 'Account', href: '#!account'});
            var about       = material.navListItem({iconClass: 'mdi-action-info', text: 'About Us', href: '#!about'});

            return [library, search, settings, account, about];
        };

        // create list containers
        var ulSideNav   = material.ul({classList: 'side-nav', id: 'mobile-nav'});
        var ulTopNav    = material.ul({classList: ['right', 'hide-on-med-and-down']});

        // add list items to ul containers
        ulSideNav.add(makeListItems());
        ulTopNav.add(makeListItems());

        // create column that holds nav
        var column12 = material.div({classList: ['col', 's12']})
            .add(material.a({classList: 'nav-title', text: 'Flyleaf.co'}))
            .add(material.a({classList: 'button-collapse', href: '/menu', data: { activates: 'mobile-nav' }})
                .add(material.i({classList: 'mdi-navigation-menu'})))
            .add(ulTopNav)
            .add(ulSideNav);

        var navbar = material.div({classList: 'navbar-fixed'})
            .add(material.nav()
                .add(material.div({classList: ['nav-wrapper', 'green']})
                    .add(column12)));

        material.render(navbar, document.body);
        material.render(material.div({classList: 'main-view'}), document.body);
        $('.button-collapse').sideNav({menuWidth: 240, activationWidth: 70, closeOnClick: true});

        // End navbar and side menu

        this.navbar = navbar;

        this.navbar.setType = function (type) {

            type = type || 'menu';
            if (type === this.type) return;

            var button = $('.button-collapse');
            var icon = $('.button-collapse i');
            var backClass = 'mdi-navigation-chevron-left';
            var menuClass = 'mdi-navigation-menu';


            button.off('click');
            if (type === 'back') {
                icon.removeClass(menuClass);
                icon.addClass(backClass);
                button.on('click', function(event) {
                    event.preventDefault();
                    window.history.back();
                });
            } else if (type === 'menu') {
                icon.removeClass(backClass);
                icon.addClass(menuClass);
                button.sideNav({menuWidth: 240, activationWidth: 70, closeOnClick: true});
            }

            this.type = type;
        };

        this.navbar.setTitle = function (title) {
            title = title || 'Flyleaf.co';
            var navTitle = document.querySelector('.nav-title');
            navTitle.innerHTML = title;
        };
    },


    library: {
        init: function () {
            var mainContainer = material.div();
            var listContainer = material.ul({id: 'library', classList: 'collection'});
            var header = material.div({classList: 'collection-header', text: 'Loading..'});

            mainContainer
                .add(header)
                .add(listContainer);

           material.view(mainContainer);
           this.header = header;
        },

        empty: function (err) {
            if (err) console.log(err);
            var mainContainer = material.div({classList: ['container', 'section']});
            mainContainer
                .add(material.p({text: 'You don\'t have books fool!'}));
            material.view(mainContainer);

        },

        makeListItem: function (manga) {

            var item = material.li({
                classList: ['collection-item', 'avatar', 'waves-effect', 'waves-green'],
                id: manga._id,
                onclick: function () {
                    // page('/manga/' + this.id);
                    console.log('test');
                }
            });

            var image = material.img({
                classList: 'thumb-image',
                src: 'http://cdn.mangaeden.com/mangasimg/' + manga.image,
                alt: manga.title
            });

            var title = material.h6({
                classList: ['title', 'flow-text', 'truncate'],
                text: manga.title
            });

            item.add(image)
                .add(title);


            var details = document.createElement('p');
                details.classList.add('flow-text');
                details.innerHTML  = 'Author: ' + manga.author + '<br>' +
                // 'Artist: ' + manga.artist + '<br>' +
                'Latest Chapter: ' + manga.chapters_len;
            item.appendChild(details);


            return item;
        },

        update: function (libArray) {

            var $library = $('#library'),
                item, i;
            for (i=0; i <= libArray.length -1; i++) {
                item = this.makeListItem(libArray[i]);
                $library.append(item);
            }
        },

        append: function () {
            // TODO: append item individually
        }
    },


    search: {
        init: function () {
            var formWrapper = material.div({classList: 'form-wrapper'});

            var inputField = material.div({classList: 'input-field'});
            var searchForm = material.form().add(inputField);


            inputField
                .add(material.input({id: 'search', type: 'text', required: true}))
                .add(material.label({'for': 'search'})
                    .add(material.i({classList: 'mdi-action-search'})))
                .add(material.div({classList: 'form-button'})
                    .add(material.i({classList: 'mdi-content-send'})));

            var header = material.div({classList: 'collection-header'})
                    .add(material.div({text:'Search'}));

            formWrapper
                .add(header)
                .add(searchForm);

            material.view(formWrapper);

            // var newFilter = function (name) {
            //     return material.p()
            //         .add(material.input({id: 'f'+name, type: 'checkbox', classList: 'filled-in'}))
            //         .add(material.label({'for': 'f'+name, text: name}));
            // };

            // data.getGenres(function (err, genres) {
            //     for (var i = 0; i < genres.length; i++) {
            //         if (i%2 !== 0) genreRight.add(newFilter(genres[i]));
            //         else genreLeft.add(newFilter(genres[i]));
            //     }
            // });
        },

        genres: function (genres) {

            var i = 0;
            var $formWrapper = $('.form-wrapper');
            var collapsible = material.ul({classList: 'collapsible', id: 'filter'})
                .set('data-collapsible', 'accordion');

            var buttonGroup = material.div({classList: 'button-group'});
            var filters = material.div({classList: 'filters'});
            var genre = material.div({classList: 'genres'});

            var genreLeft = material.div({classList: 'genresLeft'});
            var genreRight = material.div({classList: 'genresRight'});

            var newGenre = function (name) {
                return material.p()
                    .add(material.input({id: 'g'+name, type: 'checkbox', classList: 'filled-in'}))
                    .add(material.label({'for': 'g'+name, text: name}));
            };

            collapsible
                .add(material.li()
                    .add(material.div({classList: 'collapsible-header'})
                        .add(material.i({classList: 'mdi-content-filter-list'}))
                        .add(material.text('Genres')))
                    .add(material.div({classList: 'collapsible-body'})
                        .add(filters
                            .add(genre
                                .add(genreLeft)
                                .add(genreRight)))))
                .add(material.li()
                    .add(material.div({classList: 'collapsible-header'})
                        .add(material.i({classList: 'mdi-content-sort'}))
                        .add(material.text('Sort')))
                    .add(material.div({classList: 'collapsible-body'})
                        .add(material.p()
                            .add(buttonGroup))));

            buttonGroup
                .add(material.button({
                    classList: ['waves-effect', 'waves-light', 'green', 'btn'],
                    innerHTML: 'POP &#x21F5'}))
                .add(material.button({
                    classList: ['waves-effect', 'waves-light', 'green', 'btn'],
                    innerHTML: 'A-Z &#x21F5'}));

            for (i = 0; i < genres.length; i+=1) {
                if (i%2 !== 0) genreRight.add(newGenre(genres[i]));
                else genreLeft.add(newGenre(genres[i]));
            }


            $formWrapper.append(collapsible);
            $('#filter').collapsible();

        },

        updateList: function (mangaList) {
            var listContainer = $('#results')[0];
            if (listContainer === undefined) {
                material.node(material.ul({id: 'results', classList: 'collection'}));
                listContainer  = $('#results')[0];
            }

            listContainer.innerHTML = '';

            // var onclick = function () {
            //     // console.log(page);
            //     var link  = '/#!manga/' + this.id;
            //     console.log()
            //     page(link);

            // };

            for (var i = 0; i <= mangaList.length - 1; i++) {

                var item = material.li({
                    classList: ['collection-item', 'waves-effect', 'waves-green'],
                    id: mangaList[i]._id,
                    // onclick: onclick
                });

                item.add(material.h6({
                    classList: ['title', 'flow-text', 'truncate'],
                    text: mangaList[i].title
                }));

                listContainer.appendChild(
                    material.a({href: '/#!manga/' + mangaList[i]._id})
                        .add(item));
            }

            material.node(listContainer);
        }
    },


    settings: {
        init: function () {
            material.view(material.p({text: 'Nothing here yet', classList: 'container'}));
        }
    },


    account: {
        init: function () {
            material.view(material.p({text: 'Nothing here yet.', classList: 'container'}));
        }
    },


    about: {
        init: function () {
            var mainContainer = material.div({classList: ['container', 'section']});
            mainContainer
                .add(material.text('Flyleaf.co is made by '))
                .add(material.a({text: '@mythrilco', href: 'https://twitter.com/MythrilCo'}))
                .add(material.br())
                .add(material.text('Tweet at me if you have any issues.'))
                .add(material.br())
                .add(material.text('If you know what Github is and have an account, you can report issues '))
                .add(material.a({text: 'here.', href: 'https://github.com/aerze/flyleaf/issues'}))
                .add(material.br())
                .add(material.br())
                .add(material.p({text: 'Thanks for reading! :)'}));

            material.view(mainContainer);
        }
    },


    manga: {
        init: function (manga) {
            var main = material.div();
            // start parallax

            var parallaxContainer = material.div({classList: 'parallax-container'});
            var parallaxDiv = material.div({classList: 'parallax'});
            var _image = material.img({src: 'http://cdn.mangaeden.com/mangasimg/' + manga.image, classList: 'z-depth-5'});

            parallaxContainer
                .add(parallaxDiv
                    .add(_image));

            main.add(parallaxContainer);

            // end parallax
            // start section

            var sectionDiv = material.div({classList: ['container', 'white']});

            sectionDiv
                .add(material.h3({text: manga.title}))
                .add(material.h5({text: 'Author: ' + manga.author}))
                .add(material.h5({text: 'Artist: ' + manga.artist}));

            //  start button

            // var _saveString = 'Save';
            // var _saveIconString = 'mdi-action-favorite-outline';
            // if (data.checkLibrary(manga._id)) {
            //     _saveString = 'Saved';
            //     _saveIconString = 'mdi-action-favorite';
            // }

            // var _saveBook = material.button({
            //     classList: ['waves-effect', 'green', 'waves-light', 'btn'],
            //     text: _saveString,
            //     onclick: function () {
            //         var text = this.textContent;
            //         if (data.checkLibrary(manga._id)) {
            //             // _saveBook.textContent = 'Already Saved!';
            //         } else {
            //             data.saveBook(manga, function (err) {
            //                 if (err) text = 'ERROR: Could Not Save';
            //                 else text = 'Saved!';
            //                 _saveBook.textContent = text;
            //             });
            //         }
            //     }
            // });

            // sectionDiv
            //     .add(_saveBook
            //         .add(material.i({classList: [ _saveIconString, 'left' ]})));

            // End button


            // end section
            // start collapsible

            var collapsibleContainer = material.ul({classList: 'collapsible'})
                    .set('data-collapsible', 'accordion');


            var tagsCollapsibleHeader = material.div({
                classList: ['collapsible-header', 'waves-effect', 'waves-green'],
                text: 'Tags'
            });
            var tagsCollapsibleBody = material.div({classList: 'collapsible-body'});
            var _categories = material.ul({classList: 'container'});
            for (var i = manga.categories.length - 1; i >= 0; i--) {
                _categories.add(material.li({text:manga.categories[i]}));
            }


            collapsibleContainer
                .add(material.li()
                    .add(tagsCollapsibleHeader
                        .add(material.i({classList: 'mdi-notification-more'})))
                    .add(tagsCollapsibleBody
                        .add(_categories)));



            var summaryCollapsibleHeader = material.div({
                classList: ['collapsible-header', 'waves-effect', 'waves-green'],
                text: 'Summary'
            });
            var summaryCollapsibleBody = material.div({classList: 'collapsible-body'});
            var _description = material.p({innerHTML: manga.description});

            collapsibleContainer
                .add(material.li()
                    .add(summaryCollapsibleHeader
                        .add(material.i({classList: 'mdi-action-speaker-notes'})))
                    .add(summaryCollapsibleBody
                        .add(_description)));

            var loadChapter = function () {
                // flyleaf.data.readChapter(manga._id, this.index, 0);
                // flyleaf.setID('chapterIndex', this.index);
                // var chapterNumber = this.textContent.split(':')[0];
                // flyleaf.display.setNavTitle(chapterNumber);
                var link  = '/#!chapter/' + this.id;
                console.log()
                page(link);
            };

            var _chapters = material.ul({classList: 'collection'});

            _chapters
                .add(material.li({classList: 'collection-header'})
                    .add(material.h4({text: 'Chapters'})));

            for (var j = 0; j < manga.chapters.length; j++) {
                var label = (manga.chapters[j][2] === null || manga.chapters[j][2] === manga.chapters[j][0].toString()) ?
                    'CH ' + manga.chapters[j][0] :
                    'CH ' + manga.chapters[j][0] + ': ' + manga.chapters[j][2];

                var _chapterListItem = createElement('li');
                var _chapterDiv = document.createElement('div');
                    _chapterDiv.appendChild(document.createTextNode(label));
                var _chapterDIV = document.createElement('div');
                    _chapterDIV.classList.add('secondary-content');
                var _chapterIcon = document.createElement('i');

                if (manga.chapters[j][4] === undefined) {
                    _chapterIcon.classList.add('mdi-action-bookmark-outline');
                } else if (parseInt(manga.chapters[j][4]) >= 0) {
                    _chapterIcon.classList.add('mdi-action-bookmark');
                } else {
                    _chapterIcon.classList.add('mdi-action-done');
                }
                    _chapterDIV.appendChild(_chapterIcon);
                    _chapterDiv.appendChild(_chapterDIV);
                    _chapterListItem.appendChild(_chapterDiv);

                    _chapterListItem.index = j;
                    _chapterListItem.id = manga.chapters[j][3];
                    // _chapterListItem.onclick = loadChapter;
                    _chapterListItem.classList.add('collection-item', 'waves-effect', 'waves-green');

                _chapters.appendChild(
                    material.a({href: '/#!chapter/' + manga.chapters[j][3]})
                        .add(_chapterListItem));
            }

            main
                .add(sectionDiv)
                .add(collapsibleContainer)
                .appendChild(_chapters);

            material.view(main);

            $(document).ready(function(){
              $('.parallax').parallax();
              $('.collapsible').collapsible();
            });


            function createElement (elem, text) {
                var element = document.createElement(elem);
                element.textContent = text;

                return element;
            }
        }
    },


    chapter: {
        init: function (images) {
            //  for (var i = chapterInfo.images.length - 1; i >= 0; i--) {
            //     container
            //         .add(Render.img({
            //             classList: ['page', 'responsive-img'],
            //             src: 'http://cdn.mangaeden.com/mangasimg/' + chapterInfo.images[i][1]
            //         }))
            //         .add(Render.br());

            //     // images += '<img class="page responsive-img" src="http://cdn.mangaeden.com/mangasimg/' + chapterInfo.images[i][1] + '"></img><br>';
            // }
            console.log(images);

            var mainContainer = material.div();

            for (var i = images.length - 1; i >= 0; i--) {
                mainContainer
                    .add(material.img({
                        classList: ['page', 'responsive-img'],
                        src: 'http://cdn.mangaeden.com/mangasimg/' + images[i][1]
                    }))
                    .add(material.br());
            }

            material.view(mainContainer);
        }
    },


    error: function (error) {
        console.dir(error);
        this.navbar.setTitle('Oh Snap!');
        var mainContainer = material.div({classList: ['container', 'section']});
            mainContainer
                .add(material.h5({text:error.message}))
                .add(material.h6({text:error.stack}));
            material.view(mainContainer);
    }

};


module.exports = View;