'use strict';

var Auth = function () {
    this.firebase = new Firebase('https://flyleafco.firebaseio.com/');

};

Auth.prototype = Object.create(netProto);
// Auth.prototype.contructor = Auth;

Auth.prototype.getAuth = function() {
    return this.firebase.getAuth();
};

Auth.prototype.signIn = function(email, password, callback) {
    this.firebase.authWithPassword({
        'email': email,
        'password': password

    }, function onComplete (error, authData) {
        console.log(this);
        if (error) callback(error, null);
        else {
            console.log('authData', authData);
            callback(null, authData);
        }
    });
};

Auth.prototype.signUp = function(email, password, callback) {
    this.firebase.createUser({
        'email': email,
        'password': password

    }, function onComplete (error, userData) {
        console.log(this);
        if (error) callback(error, null);
        else {
            console.log('userData', userData);
            callback(null, userData);
        }
    });
};

Auth.prototype.signOut = function() {
    this.firebase.unauth();
};