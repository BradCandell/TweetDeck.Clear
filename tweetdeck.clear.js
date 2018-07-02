// ==UserScript==
// @name            TweetDeck.Clear
// @version         1.0.4
// @author          Brad Candell
// @description     Adds a more convenient ways to clear a column or columns using the TD Controller for a much smoother interaction
// @match           https://tweetdeck.twitter.com/*
// @match           https://www.tweetdeck.twitter.com/*
// @grant           none
// @license         License:X11 (MIT)
// ==/UserScript==

var $ = window.$, TD = window.TD;


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}


// Arrange the markup for the clear options
var clearButton = '<a class="tdc-clear-column js-action-header-button column-header-link clear-all-link" data-action="clear"><i class="icon icon-clear-timeline" data-placement="bottom" title="" data-original-title="Clear Timeline"></i></a>';
var clearAllButton = '<a class="tdc-clear-all js-header-action js-app-settings link-clean cf app-nav-link padding-h--10" data-action="clear-all" data-title="Clear All"> <div class="obj-left margin-l--2"> <i class="icon icon-clear-timeline icon-medium"></i> </div> <div class="nbfc padding-ts hide-condensed txt-size--16 app-nav-link-text">Clear All</div> </a>';

// Modify the mustache template to include the respective modifications
window.TD_mustaches["column/column_header.mustache"] = window.TD_mustaches["column/column_header.mustache"].replace('<div class="column-header-links">', '<div class="column-header-links">' + clearButton);
window.TD_mustaches["topbar/app_header.mustache"] = window.TD_mustaches["topbar/app_header.mustache"].replace('</a> </nav>', '</a>' + clearAllButton + '</nav>');



$(document.body).delegate('.tdc-clear-column', 'click', function() {
   console.log('clicked'); 
});

$(document.body).delegate('.tdc-clear-all', 'click', function() {
   console.log('clicked all'); 
});

$(document).on('click', '.tdc-clear-column', function () {
    var columnId = $(this).parents('.js-column').data('column');
    TD.controller.columnManager.get(columnId).clear()
    return false;
});

$(document).on('click', '.tdc-clear-all', function () {
    TD.controller.columnManager.getAllOrdered().forEach(y => {
        if (y.model.state.type == 'other') {
           y.clear();
        }
    });
    return false;
});

addGlobalStyle('html.dark .column-title .attribution { font-size: 11px; }');
