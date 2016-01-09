'use strict';

var render = require('./render');

var Material = Object.create(render);

Material.navListItem = function (options) {
        
    var text = options.text || '';
    var href = options.href || '#';
    var iconClass = [];
        iconClass.push('left');
        
    if (options.iconClass) iconClass.push(options.iconClass);
    
    var navli = this.li()
        .add(this.a({href: href})
            .add(this.i({classList: iconClass}))
            .add(this.text(text)));
    
    return navli;
}


Material.modal = function (id, content, footer) {
    
    var modal = this.div({ id: id, classList: 'modal'});
    var modalContent = this.div({classList: 'modal-content'}).add(content);
    var modalFooter = this.div({classList: 'modal-footer'}).add(footer);
    
    modal.add(modalContent);
    if (footer) modal.add(modalFooter);
    
    return modal;
    // <div id="modal1" class="modal">
    //     <div class="modal-content">
    //       <h4>Modal Header</h4>
    //       <p>A bunch of text</p>
    //     </div>
    //     <div class="modal-footer">
    //       <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
    //     </div>
    // </div>
}

Material.render = Material.node;
Material.renderView = function (node, view) {
    view = view || document.querySelector('.main-view');
    view.innerHTML = '';
    $(window).scrollTop(0);
    view.appendChild(node);
}

module.exports = Material;