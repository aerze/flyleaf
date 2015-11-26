'use strict';

var page = require('page');
var auth = require('./lib/auth');

var viewHandler = require('./handler/viewHandler');
var dataHandler = require('./handler/dataHandler');

page('*', viewHandler.init, dataHandler.init);

// redirect to library
page('/', function () { page('/library'); });
page('/library', viewHandler.library);

page('/search', viewHandler.search);


page('/settings', viewHandler.settings);

page('/account', viewHandler.account);

page('/about', viewHandler.about);

// page('/settings')

page.start({hashbang: true});