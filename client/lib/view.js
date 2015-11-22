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
        init: function (context, next) {
            var mainContainer = material.div();
            var listContainer = material.ul({id: 'library', classList: 'collection'});
            var header = material.div({classList: 'collection-header'})
                .add(material.div({text: 'Loading..'}));
                
            mainContainer
                .add(header)
                .add(listContainer);
                
           material.renderView(mainContainer);
        }
    }
};


module.exports = View;