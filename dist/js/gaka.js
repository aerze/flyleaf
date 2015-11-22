'use strict';
/*globals page */
var Gaka = {
    
    mainNode: {},

    renderNode: function (node) {
        this.mainNode.innerHTML = '';
        this.mainNode.appendChild(node);
    },

    renderString: function (string) {
        this.mainNode.innerHTML = string;
    },

    renderBookList: function (list) {
        var view = document.createElement('ul');
            view.classList.add('booklist');

            for (var i = 0; i <= list.length - 1; i++) {
                var item = makeListItem(list[i], list[i].image, true);
                view.appendChild(item);
            }
        this.renderNode(view);

        var makeListItem = function(manga, imageID, detail) {
            var item = document.createElement('li');
                item.classList.add('collection-item', 'avatar');
                item.id = manga._id;
                item.onclick = function () { page('/manga/' + this.id); };

            var image = document.createElement('img');
                image.src = 'http://cdn.mangaeden.com/mangasimg/' + imageID;
                image.alt = manga.title;
                image.classList.add('thumb-image');
            item.appendChild(image);

            var title = document.createElement('h6');
                title.classList.add('title', 'flow-text');
                title.textContent = manga.title;
            item.appendChild(title);

            if (detail) {
                var details = document.createElement('p');
                    details.innerHTML  = 'Author: ' + manga.author + '<br>' +
                    // 'Artist: ' + manga.artist + '<br>' +
                    'Latest Chapter: ' + manga.chapters_len;
                item.appendChild(details);
            }

            return item;
        };
    }

};