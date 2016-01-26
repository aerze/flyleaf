'use strict';

var page = require('page');
var auth = require('./lib/auth');

var viewHandler = require('./handler/viewHandler');
var dataHandler = require('./handler/dataHandler');
// var authHandler = require('./handler/authHandler');

// on every page load
page('*', function (ctx, next) {
    ctx.state.paths = ctx.paths || [];
    ctx.state.paths.push(ctx.path);
    ctx.save();

    console.log(window.history, ctx);
    next();
}, viewHandler.init, dataHandler.init);

// redirect to library
page('/', function () { page('/#!library'); });

page('/library', dataHandler.library, viewHandler.library);

page('/search', dataHandler.search, viewHandler.search);

page('/settings', viewHandler.settings);

page('/account', viewHandler.account);

page('/about', viewHandler.about);

page('/manga/:id', dataHandler.manga, viewHandler.manga);

page('/chapter/:id', dataHandler.chapter, viewHandler.chapter);

// page.base('/#!/');
page.start({hashbang: true, popstate:true, click: false});