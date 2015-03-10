'use strict';

var Display = {
    mainView : document.querySelector('.main-view'),
    renderString: function (string) {
        this.mainView.innerHTML = string;
    },
    renderNode: function (node) {
        this.mainView.innerHTML = '';
        this.mainView.appendChild(node);
    },
    // renderList: function (array) {
    //     console.log('display.js:: renderList');
        
    //     var list = document.createElement('ul'); 
    //     for (var i = 0; i <= array.length - 1; i+=1) {
    //         // var item = document.createElement('li');
    //         // item.innerHTML = array[i];  
    //         // list.appendChild(item);

    //         list.appendChild(array[i]);
    //     }

    //     this.renderNode(list);
    // },

    search: function (manga) {
        // add search filter
        // display list after each filter change

        this.renderString('<div class="nav-wrapper"><form><div class="input-field"><input id="search" type="text" required><label for="search"><i class="mdi-action-search"></i></label></div></form><div class="button-group"><button class="waves-effect waves-light green btn"> POP &#x21F5 </button><button class="waves-effect waves-light green btn"> A-Z &#x21F5 </button></div></div><div class="sub-view"></div>');

        var searchList =  [];
        searchList = manga;
        console.log(searchList.length);

        var inputView = $('#search');
        var subView = $('.sub-view');
        inputView.on('input', function(event) {
            console.log('Event fired');
            renderList(searchList, event.target.value, subView[0]);
        });



        renderList(searchList, '', subView[0]);

        function renderList(list, filter, view) {
            console.log('rendering');
            var all = (filter === '') ? true : false ;
            var listContainer = document.createElement('ul');
            filter = filter.toLowerCase();
            view.innerHTML = '';

            if (all) {
                for (var i = list.length - 1; i >= 0; i--) {
                    var item = new Item(list[i].doc);
                    listContainer.appendChild(item);
                }
            } else {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i].doc.title.toLowerCase().indexOf(filter) > -1) {
                        var item = document.createElement('li');
                        item.innerHTML = list[i].doc.title;
                        listContainer.appendChild(item);
                    } else if (list[i].doc.alias.indexOf(filter) > -1) {
                        var item = document.createElement('li');
                        item.innerHTML = list[i].doc.title;
                        listContainer.appendChild(item);
                    }
                }
            }
            view.appendChild(listContainer);
        }

        function Item (doc) {
            var item = document.createElement('li');
            item.innerHTML = doc.title;
            item.id = doc._id;
            item.alias = doc.alias;
            item.onclick =  function() {
                page('/manga/' + this.id);
            };
            return item;
        }
    },

    manga: function(manga) {
        console.log(manga);
        this.renderString('manga loaded');
        
        var image = '<img src="https://cdn.mangaeden.com/mangasimg/' + manga.image + '"></img>';
        var title = '<h3>' + manga.title + '</h3>';
        var author = '<h5> Author: ' + manga.author + '</h5>';
        var artist = '<h5> Artist: ' + manga.artist + '</h5>';
        var categories = '<ul><li>' + manga.categories.join('</li><li>') + '</li>';
        var description = '<p>' + manga.description + '</p>';
        var chapters = '<ul>';
        for (var i = manga.chapters.length - 1; i >= 0; i--) {
            chapters += '<li>' + manga.chapters[i][0] + ': ' + manga.chapters[i][2] + '</li>';
        }
        chapters += '</ul>';

        var view = image + title + author + artist + categories + description + chapters;
        this.renderString(view);
    },

    startLoading: function (caller, process) {
        var string = caller + ':: Loading > ' + process; 
        console.log(string);
        this.renderString(string);
    },
    endLoading: function (caller, process) {
        var string = caller + '::  Loaded < ' + process;
        console.log(string);
        this.renderString(string);
    },

    error: function (string) {
        this.renderString(string);
    }

};

// function View () {
//     var mainView = document.querySelector('.main-view');

//     this.render = function (context) {
//         console.log('ROUTER:: Route Set: ' + context.path);
//         mainView.innerHTML = 'Manga';
//     };
// }