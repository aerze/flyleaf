/* global 
    page: true,
    Flyleaf: true
    */
'use strict';
var flyleaf = new Flyleaf();

page('*', flyleaf.init);
page('/', flyleaf.home);
page('/myBooks', flyleaf.myBooks);
page('/search', flyleaf.search);
page('/settings', flyleaf.settings);
page('/aboutUs', flyleaf.aboutUs);
page('/manga/:id', flyleaf.manga);
page('/chapter/:id', flyleaf.chapter);
page.start({hashbang: true});



