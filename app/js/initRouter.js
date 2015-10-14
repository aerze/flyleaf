/* global 
    page: true,
    Flyleaf: true
    */
'use strict';
var flyleaf = new Flyleaf();
// This is the App namespace, I'm not sure why it's a class...

// load local database
// check authorization
page('*', flyleaf.init, flyleaf.authCheck);

page('/', flyleaf.home);
page('/myBooks', flyleaf.myBooks);
page('/search', flyleaf.search);
page('/settings', flyleaf.settings);
page('/myAccount', flyleaf.myAccount);
page('/aboutUs', flyleaf.aboutUs);
page('/manga/:id', flyleaf.manga);
page('/chapter/:id', flyleaf.chapter);
page.start({hashbang: true});