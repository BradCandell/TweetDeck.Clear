// ==UserScript==
// @name            TweetDeck.Clear
// @version         1.0.0
// @description     Add more convenient ways to clear a column or columns.
// @match           https://tweetdeck.twitter.com/*
// @match           http://tweetdeck.twitter.com/*
// @match           https://www.tweetdeck.twitter.com/*
// @match           http://www.tweetdeck.twitter.com/*
// @grant           none
// @license         License:X11 (MIT)
// ==/UserScript==


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
