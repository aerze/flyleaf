'use strict';

var page = require('page');
var auth = require('./lib/auth');

var viewHandler = require('./handler/viewHandler');

page('*', viewHandler.init);

// redirect to library
page('/', function () { page('/library'); });
page('/library', viewHandler.library);

page.start({hashbang: true});