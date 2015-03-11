'use strict';
var NOTYET = new Error('YOU HAVEN\'T IMPLEMENTED THIS YET!');
var problem = function(error) {
    console.error(error);
    display.renderString(error.stack);
    throw error;
};