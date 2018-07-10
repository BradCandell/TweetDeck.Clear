// ==UserScript==
// @name            TweetDeck.Clear
// @version         1.0.5
// @author          Brad Candell
// @description     Adds a more convenient ways to clear a column or columns using the TD Controller for a much smoother interaction
// @match           https://tweetdeck.twitter.com/*
// @match           https://www.tweetdeck.twitter.com/*
// @grant           none
// @license         License:X11 (MIT)
// ==/UserScript==


const moduleRaid = function (debug) {
  moduleRaid.mID  = Math.random().toString(36).substring(7);
  moduleRaid.mObj = {};
  moduleRaid.cArr = [];

  if (debug) {
    moduleRaid.debug = true;
  } else if (window.mRdebug) {
    moduleRaid.debug = true;
  } else {
    moduleRaid.debug = false;
  }

  moduleRaid.log = function (message) {
    if (moduleRaid.debug) {
      console.warn(`[moduleRaid] ${message}`);
    }
  }

  moduleRaid.args = [
    [[0], [function(e, t, i) {
      mCac = i.c;
      Object.keys(mCac).forEach (function(mod) {
        moduleRaid.mObj[mod] = mCac[mod].exports;
      })
      moduleRaid.cArr = i.m;
    }]],
    [[1e3], {[moduleRaid.mID]: function(e, t, i) {
      mCac = i.c;
      Object.keys(mCac).forEach (function(mod) {
        moduleRaid.mObj[mod] = mCac[mod].exports;
      })
      moduleRaid.cArr = i.m;
    }}, [[moduleRaid.mID]]]
  ]

  fillModuleArray = function() {
    if (typeof webpackJsonp === 'function') {
      moduleRaid.args.forEach(function (argument, index) {
        try {
          webpackJsonp(...argument);
        }
        catch (err) {
          moduleRaid.log(`moduleRaid.args[${index}] failed: ${err}`);
        }
      })
    }
    else {
      try {
        webpackJsonp.push(moduleRaid.args[1]);
      }
      catch (err) {
        moduleRaid.log(`Pushing moduleRaid.args[1] into webpackJsonp failed: ${err}`);
      }
    }

    if (moduleRaid.mObj.length == 0) {
      mEnd = false;
      mIter = 0;

      if (!webpackJsonp([],[],[mIter])) {
        throw Error('Unknown Webpack structure');
      }

      while (!mEnd) {
        try {
          moduleRaid.mObj[mIter] = webpackJsonp([],[],[mIter]);
          mIter++;
        }
        catch (err) {
          mEnd = true;
        }
      }
    }
  }

  fillModuleArray()

  get = function get (id) {
    return moduleRaid.mObj[id]
  }

  findModule = function findModule (query) {
    results = [];
    modules = Object.keys(moduleRaid.mObj);

    modules.forEach(function(mKey) {
      mod = moduleRaid.mObj[mKey];

      if (typeof mod !== 'undefined') {
        if (typeof mod.default === 'object') {
          for (key in mod.default) {
            if (key == query) results.push(mod);
          }
        }

        for (key in mod) {
          if (key == query) results.push(mod);
        }
      }
    })

    return results;
  }

  findFunction = function(query) {
    if (moduleRaid.cArr.length == 0) {
      throw Error('No module constructors to search through!');
    }

    results = [];

    if (typeof query === 'string') {
      moduleRaid.cArr.forEach(function (ctor, index) {
        if (ctor.toString().includes(query)) {
          results.push(moduleRaid.mObj[index]);
        }
      })
    } else if (typeof query === 'function') {
      modules = Object.keys(moduleRaid.mObj);

      modules.forEach(function(mKey, index) {
        mod = moduleRaid.mObj[mKey];

        if (query(mod)) {
          results.push(moduleRaid.mObj[index]);
        }
      })
    } else {
      throw new TypeError('findFunction can only find via string and function, ' + (typeof query) + ' was passed');
    }

    return results;
  }

  return {
    modules: moduleRaid.mObj,
    constructors: moduleRaid.cArr,
    findModule: findModule,
    findFunction: findFunction,
    get: get
  }
}

if (typeof module === 'object' && module.exports) {
  module.exports = moduleRaid;
} else {
  window.mR = moduleRaid();
}


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



//$(document.body).delegate('.tdc-clear-column', 'click', function() {
//   console.log('clicked'); 
//});

//$(document.body).delegate('.tdc-clear-all', 'click', function() {
//   console.log('clicked all'); 
//});

//$(document).on('click', '.tdc-clear-column', function () {
//    var columnId = $(this).parents('.js-column').data('column');
//    TD.controller.columnManager.get(columnId).clear()
//    return false;
//});

//$(document).on('click', '.tdc-clear-all', function () {
//    TD.controller.columnManager.getAllOrdered().forEach(y => {
//        if (y.model.state.type == 'other') {
//           y.clear();
//        }
//    });
//    return false;
//});

addGlobalStyle('html.dark .column-title .attribution { font-size: 11px; }');
