/* global 
    page: true,
    Flyleaf: true
    */
'use strict';
var flyleaf = new Flyleaf();

page('/', flyleaf.home);
page('/search', flyleaf.search);
page('/myBooks', flyleaf.myBooks);
page('/settings', flyleaf.settings);
page('/aboutUs', flyleaf.aboutUs);
page('/manga/:id', flyleaf.manga);
page.start({hashbang: true});



