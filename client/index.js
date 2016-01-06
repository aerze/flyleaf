'use strict';

var page = require('page');
var auth = require('./lib/auth');

var viewHandler = require('./handler/viewHandler');
var dataHandler = require('./handler/dataHandler');

page('*', viewHandler.init, dataHandler.init); // on every page load

page('/', function () { page('/library'); }); // redirect to library

page('/library', dataHandler.library, viewHandler.library);

page('/search', dataHandler.search, viewHandler.search);

page('/settings', viewHandler.settings);

page('/account', viewHandler.account);

page('/about', viewHandler.about);

page('/manga/:id', dataHandler.manga, viewHandler.manga);

page('/chapter/:id', dataHandler.chapter, viewHandler.chapter);

page.start({hashbang: true});