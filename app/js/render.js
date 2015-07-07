'use strict';
/*jshint browser: true, jquery: true */

var Render = {
    view: function (node, view) {
        view = view || document.querySelector('.main-view');
        view.innerHTML = '';
        $(window).scrollTop(0);
        view.appendChild(node);
    },
    node: function (node, view) {
        view = view || document.querySelector('.main-view');
        view.appendChild(node);
    },
    fullpage: function (node) {
        var mainNode = document.querySelector('body');
        var fullpage = document.querySelector('.fullpage');
        var container = document.querySelector('.container');

        if (fullpage) {
            setTimeout( function () {
                container.classList.add('fade-out');
                setTimeout(function () {
                    fullpage.remove();
                    fadeInPage();
                }, 1000);
            }, 1000);
        } else {
            fadeInPage();
        }

        function fadeInPage () {
            mainNode.innerHTML = '';
            mainNode.appendChild(node);
            node.classList.add('fade-in');
        }
    },
    element: function (elementType, options) {
        var element = document.createElement(elementType);
            element.add = function (node) {
                this.appendChild(node);
                return this;
            };
            element.addTo = function (node) {
                node.appendChild(this);
                return this;
            };
            element.set = function (key, value) {
                this.setAttribute(key, value);
                return this;
            };

        if (options) {
            if (options.classList) {
                if (Array.isArray(options.classList)) {
                    for (var i = 0; i <= options.classList.length - 1; i+=1) {
                        element.classList.add(options.classList[i]);
                    }
                } else { element.classList.add(options.classList); }
            }
            if (options.id) {
                element.id = options.id;
            }
            if (options.text) {
                var text = document.createTextNode(options.text);
                element.appendChild(text);
            }
            if (options.innerHTML) {
                element.innerHTML = options.innerHTML;
            }
            if (options.onclick) {
                element.onclick = options.onclick;
            }
        }

        return element;
    },
    i:  function (options) { return this.element('i', options); },
    p:  function (options) { return this.element('p', options); },
    h1: function (options) { return this.element('h1', options); },
    h2: function (options) { return this.element('h2', options); },
    h3: function (options) { return this.element('h3', options); },
    h4: function (options) { return this.element('h4', options); },
    h5: function (options) { return this.element('h5', options); },
    h6: function (options) { return this.element('h6', options); },
    hr: function (options) { return this.element('hr', options); },
    ul: function (options) { return this.element('ul', options); },
    li: function (options) { return this.element('li', options); },
    div:    function (options) { return this.element('div', options); },
    text:   function (text)    { return document.createTextNode(text); },
    form:   function (options) { return this.element('form', options); },
    legend: function (options) { return this.element('legend', options); },
    fieldset: function (options) { return this.element('fieldset', options); },

    img: function (options) {
        var img = this.element('img', options);
        if (options) {
            if (options.src) { img.src = options.src; }
            if (options.alt) { img.alt = options.alt; }
        }
        return img;
    },

    label: function (options) {
        var label = this.element('label', options);
        if (options && options.for) label.setAttribute('for', options.for);
        return label;
    },

    input: function (options) {
        var input = this.element('input', options);
        if (options) {
            if (options.type) input.setAttribute('type', options.type);
            if (options.placeholder) input.setAttribute('placeholder', options.placeholder);
            if (options.name) input.setAttribute('name', options.name);
            if (options.required) input.setAttribute('required', 'required');
        }

        return input;
    },

    button: function (options) {
        var button = this.element('button', options);
        if (options) {
            if (options.type) {
                button.setAttribute('type', options.type);
            }
        }
        return button;
    }
};