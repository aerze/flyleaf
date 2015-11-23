'use strict';

var material = require('./material');

var View = {
    
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
            navTitle.innerText = title;
        }
    },
    
    
    library: {
        init: function () {
            var mainContainer = material.div();
            var listContainer = material.ul({id: 'library', classList: 'collection'});
            var header = material.div({classList: 'collection-header', text: 'Loading..'});
                // .add(material.div({}));
                
            mainContainer
                .add(header)
                .add(listContainer);
                
           material.materialView(mainContainer);
           this.header = header;
        },
        
        error: function (error) {
            this.header.innerText = error;
        },
        
        makeListItem: function () {
            // TODO: generate a new li
        },
        
        update: function () {
            // TODO: update list using an array
        },
        
        append: function () {
            // TODO: append item individually
        }
    },
    
    
    search: {
        init: function () {
            var formWrapper = material.div({classList: 'form-wrapper'});
            var buttonGroup = material.div({classList: 'button-group'});
            var collapsible = material.ul({classList: 'collapsible', id: 'filter'})
                .set('data-collapsible', 'accordion');
            var inputField = material.div({classList: 'input-field'});
            var searchForm = material.form().add(inputField);
            var filters = material.div({classList: 'filters'});
            var genre = material.div({classList: 'genres'})
                .add(material.h6({text: 'Genres'}));
            var genreLeft = material.div({classList: 'genresLeft'});
            var genreRight = material.div({classList: 'genresRight'});

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

            inputField
                .add(material.input({id: 'search', type: 'text', required: true}))
                .add(material.label({'for': 'search'})
                    .add(material.i({classList: 'mdi-action-search'})))
                .add(material.div({classList: 'form-button'})
                    .add(material.i({classList: 'mdi-content-send'})));

            collapsible
                .add(material.li()
                    .add(material.div({classList: 'collapsible-header'})
                        .add(material.i({classList: 'mdi-content-filter-list'}))
                        .add(material.text('Genre Filter')))
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


            var header = material.div({classList: 'collection-header'})
                    .add(material.div({text:'Search'}));

            formWrapper
                .add(header)
                .add(searchForm)
                .add(collapsible);

            material.view(formWrapper);
            $('#filter').collapsible();
        }
    }
};


module.exports = View;