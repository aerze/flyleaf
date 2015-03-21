'use strict';

var devProto = {
    warn: function (err) {
        console.log('Warning :: ' + err.message);
        console.log(err.stack);
    },
    fail: function (err) {
        console.log('Failure :: ' + err.message);
        console.log(err.stack);
        console.log('Refresh required');
    },
    notYet: function (err) {
        console.log('Not Implemented Yet :: ' + err.message);
        console.log('Sorry :c');
    },
    check: function (object) {
        console.log(object.toString());
        if (object === null) console.log('Object is null');
        else if (object === undefined) console.log('Object is undefined');
        else if (object) console.log('Object exists');
        else console.log('I have no idea what happened');
    },
    window: function (string) {
        if (window[string] !== undefined) console.log('Object is global');
    }
};
var Dev = Object.create(devProto);