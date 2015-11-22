'use strict';

var Firebase = require('firebase');
var net = require('./net');

var Auth = Object.create(net);

Auth.firebase = new Firebase('https://flyleafco.firebaseio.com/');

Auth.getAuth = function() {
    return this.firebase.getAuth();
};

Auth.signIn = function(email, password, callback) {
    
    this.firebase.authWithPassword({
        
        'email': email,
        'password': password

    }, function onComplete (error, authData) {
        
        if (error) callback(error, null);
        else {
            console.log('authData', authData);
            callback(null, authData);
            
        }
    });
};

Auth.signUp = function(email, password, callback) {
    
    this.firebase.createUser({
        
        'email': email,
        'password': password

    }, function onComplete (error, userData) {
        
        if (error) callback(error, null);
        else {
            console.log('userData', userData);
            callback(null, userData);
            
        }
    });
};

Auth.signOut = function() {
    this.firebase.unauth();
};

module.exports = Auth;