webpackJsonp([1],{

/***/ 56:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./drivers/indexeddb": 52,
		"./drivers/indexeddb.js": 52,
		"./drivers/localstorage": 53,
		"./drivers/localstorage.js": 53,
		"./drivers/websql": 55,
		"./drivers/websql.js": 55,
		"./ember-adapter.js.old": 57,
		"./ember-driver.js.old": 58,
		"./localforage": 48,
		"./localforage.js": 48,
		"./utils/serializer": 54,
		"./utils/serializer.js": 54
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 56;


/***/ },

/***/ 57:
/***/ function(module, exports) {

	/*global DS*/
	/*global Ember*/
	/*global localForage*/
	'use strict';

	DS.LSAdapter = DS.Adapter.extend(Ember.Evented, {
	    S4: function() {
	        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
	    },

	    init: function() {
	        this._loadData();
	    },

	    generateIdForRecord: function () {
	        return this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4();
	    },

	    // OTHER LIB STARTS HERE:

	    find: function(store, type, id) {
	        var namespace = this._namespaceForType(type);
	        return Ember.RSVP.resolve(Ember.copy(namespace.records[id]));
	    },

	    findMany: function(store, type, ids) {
	        var namespace = this._namespaceForType(type);
	        var results = [];
	        for (var i = 0; i < ids.length; i++) {
	            results.push(Ember.copy(namespace.records[ids[i]]));
	        }
	        return Ember.RSVP.resolve(results);
	    },

	  // Supports queries that look like this:
	  //
	  //   {
	  //     <property to query>: <value or regex (for strings) to match>,
	  //     ...
	  //   }
	  //
	  // Every property added to the query is an "AND" query, not "OR"
	  //
	  // Example:
	  //
	  //  match records with "complete: true" and the name "foo" or "bar"
	  //
	  //    { complete: true, name: /foo|bar/ }
	    findQuery: function (store, type, query, recordArray) {
	        var namespace = this._namespaceForType(type);
	        var results = this.query(namespace.records, query);
	        return Ember.RSVP.resolve(results);
	    },

	    query: function (records, query) {
	        var results = [];
	        var id, record, property, test, push;
	        for (id in records) {
	            record = records[id];
	            for (property in query) {
	                test = query[property];
	                push = false;
	                if (Object.prototype.toString.call(test) === '[object RegExp]') {
	                    push = test.test(record[property]);
	                } else {
	                    push = record[property] === test;
	                }
	            }
	            if (push) {
	                results.push(record);
	            }
	        }
	        return results;
	    },

	    findAll: function (store, type) {
	        var namespace = this._namespaceForType(type);
	        var results = [];
	        for (var id in namespace.records) {
	            results.push(Ember.copy(namespace.records[id]));
	        }
	        return Ember.RSVP.resolve(results);
	    },

	    createRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        this._addRecordToNamespace(namespace, record);
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	    updateRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        var id = record.get('id');
	        namespace.records[id] = record.toJSON({ includeId: true });
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	    deleteRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        var id = record.get('id');
	        delete namespace.records[id];
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	  // private

	    _getNamespace: function () {
	        return this.namespace || 'DS.LFAdapter';
	    },

	    _loadData: function () {
	        var storage = localStorage.getItem(this._getNamespace());
	        this._data = storage ? JSON.parse(storage) : {};
	    },

	    _saveData: function () {
	        localStorage.setItem(this._getNamespace(), JSON.stringify(this._data));
	    },

	    _namespaceForType: function (type) {
	        var namespace = type.url || type.toString();
	        return this._data[namespace] || (
	            this._data[namespace] = {records: {}}
	        );
	    },

	    _addRecordToNamespace: function (namespace, record) {
	        var data = record.serialize({includeId: true});
	        namespace.records[data.id] = data;
	    }
	});


/***/ },

/***/ 58:
/***/ function(module, exports) {

	/*global DS*/
	/*global Ember*/
	/*global localForage*/
	'use strict';

	DS.LSAdapter = DS.Adapter.extend(Ember.Evented, {
	    S4: function() {
	        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
	    },

	    init: function() {
	        this._loadData();
	    },

	    generateIdForRecord: function () {
	        return this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4();
	    },

	    // OTHER LIB STARTS HERE:

	    find: function(store, type, id) {
	        var namespace = this._namespaceForType(type);
	        return Ember.RSVP.resolve(Ember.copy(namespace.records[id]));
	    },

	    findMany: function(store, type, ids) {
	        var namespace = this._namespaceForType(type);
	        var results = [];
	        for (var i = 0; i < ids.length; i++) {
	            results.push(Ember.copy(namespace.records[ids[i]]));
	        }
	        return Ember.RSVP.resolve(results);
	    },

	  // Supports queries that look like this:
	  //
	  //   {
	  //     <property to query>: <value or regex (for strings) to match>,
	  //     ...
	  //   }
	  //
	  // Every property added to the query is an "AND" query, not "OR"
	  //
	  // Example:
	  //
	  //  match records with "complete: true" and the name "foo" or "bar"
	  //
	  //    { complete: true, name: /foo|bar/ }
	    findQuery: function (store, type, query, recordArray) {
	        var namespace = this._namespaceForType(type);
	        var results = this.query(namespace.records, query);
	        return Ember.RSVP.resolve(results);
	    },

	    query: function (records, query) {
	        var results = [];
	        var id, record, property, test, push;
	        for (id in records) {
	            record = records[id];
	            for (property in query) {
	                test = query[property];
	                push = false;
	                if (Object.prototype.toString.call(test) === '[object RegExp]') {
	                    push = test.test(record[property]);
	                } else {
	                    push = record[property] === test;
	                }
	            }
	            if (push) {
	                results.push(record);
	            }
	        }
	        return results;
	    },

	    findAll: function (store, type) {
	        var namespace = this._namespaceForType(type);
	        var results = [];
	        for (var id in namespace.records) {
	            results.push(Ember.copy(namespace.records[id]));
	        }
	        return Ember.RSVP.resolve(results);
	    },

	    createRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        this._addRecordToNamespace(namespace, record);
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	    updateRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        var id = record.get('id');
	        namespace.records[id] = record.toJSON({ includeId: true });
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	    deleteRecord: function (store, type, record) {
	        var namespace = this._namespaceForType(type);
	        var id = record.get('id');
	        delete namespace.records[id];
	        this._saveData();
	        return Ember.RSVP.resolve();
	    },

	  // private

	    _getNamespace: function () {
	        return this.namespace || 'DS.LFAdapter';
	    },

	    _loadData: function () {
	        var storage = localStorage.getItem(this._getNamespace());
	        this._data = storage ? JSON.parse(storage) : {};
	    },

	    _saveData: function () {
	        localStorage.setItem(this._getNamespace(), JSON.stringify(this._data));
	    },

	    _namespaceForType: function (type) {
	        var namespace = type.url || type.toString();
	        return this._data[namespace] || (
	            this._data[namespace] = {records: {}}
	        );
	    },

	    _addRecordToNamespace: function (namespace, record) {
	        var data = record.serialize({includeId: true});
	        namespace.records[data.id] = data;
	    }
	});


/***/ }

});