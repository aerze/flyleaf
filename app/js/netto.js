'use strict';

var Netto = function() {
	this.xhr  = function(type, path, data, callback) {
		if (data === null || data === undefined) {
			data = '';
		}
		var request = new XMLHttpRequest();
		request.open(type, path, true);
		request.onreadystatechange = function () {
			if (request.readyState !== 4 || request.status !== 200) return;
			callback(request.responseText);
		};
		// request.setRequestHeader('content-type', 'application/octet-stream');
		request.send(data);
	};

	this.proxy = function(path, callback) {
		this.xhr('post', '/proxy', path, callback);
	};

	this.get = function(path, callback) {
		this.xhr('get', path, null, callback);
	};
};

console.log('(ネット) netto.js:: loaded');