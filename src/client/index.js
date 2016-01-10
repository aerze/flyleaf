'use strict';

var page = require('page');
var auth = require('./lib/auth');

var viewHandler = require('./handler/viewHandler');
var dataHandler = require('./handler/dataHandler');
var authHandler = require('./handler/authHandler');

// on every page load
page('*', viewHandler.init, authHandler.init, dataHandler.init);

// redirect to library
page('/', function () { page('/library'); });

page('/library', dataHandler.library, viewHandler.library);

page('/search', dataHandler.search, viewHandler.search);

page('/settings', viewHandler.settings);

page('/account', viewHandler.account);

page('/about', viewHandler.about);

page('/manga/:id', dataHandler.manga, viewHandler.manga);

page('/chapter/:id', dataHandler.chapter, viewHandler.chapter);

page.start({hashbang: true});