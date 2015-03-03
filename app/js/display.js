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
    renderList: function (array) {
        console.log('display.js:: renderList');
        
        var list = document.createElement('ul'); 
        for (var i = 0; i <= array.length - 1; i+=1) {
            // var item = document.createElement('li');
            // item.innerHTML = array[i];  
            // list.appendChild(item);

            list.appendChild(array[i]);
        }

        this.renderNode(list);
    },

    manga: function () {
        console.log('display.js:: manga');
        // add search filter
        // display list after each filter change
    }
};

// function View () {
//     var mainView = document.querySelector('.main-view');

//     this.render = function (context) {
//         console.log('ROUTER:: Route Set: ' + context.path);
//         mainView.innerHTML = 'Manga';
//     };
// }