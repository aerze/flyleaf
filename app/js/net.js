'use strict';

var netProto  = {
	xhr: function (type, path, data, callback) {
		if (data === null || data === undefined) {
			data = '';
		}
		var request = new XMLHttpRequest();
		request.open(type, path, true);
		request.onreadystatechange = function () {
			if (request.readyState !== 4 || request.status !== 200) return;
			callback(request.responseText);
		};
		request.send(data);
	},

	proxy: function (path, callback) {
		this.xhr('post', '/proxy', path, callback);
	},

	get: function (path, callback) {
		this.xhr('get', path, null, callback);
	},

	getJson: function (path, callback) {
		this.get(path, function (data) {
			callback(JSON.parse(data));
		});
	}
};
var Net = Object.create(netProto);
