'use strict';

var auth = require('../lib/auth');

var AuthHandler = {

    // TODO:
    // detect for auth
    // if first try trigger login
    init: function (context, next) {

        console.dir(auth);

    },

    loginModal: function () {

    }

};

module.exports = AuthHandler;