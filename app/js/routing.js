/* global 
    page: true
    */
'use strict';
var flyleaf = new Flyleaf();

page('/', flyleaf.init);
page('/manga', flyleaf.manga);
page('/myBooks', flyleaf.myBooks);
page('/settings', flyleaf.settings);
page('/aboutUs', flyleaf.aboutUs);
page.start({hashbang: true});



