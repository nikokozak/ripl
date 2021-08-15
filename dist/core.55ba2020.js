// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/utils.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grid_y_to_y = exports.grid_x_to_x = exports.unsafe = exports.mod = void 0;

var settings_1 = __importDefault(require("./settings"));

function mod(n, m) {
  return (n % m + m) % m;
}

exports.mod = mod;

function unsafe(x, y) {
  return x > settings_1.default.cols - 1 || x < 0 || y > settings_1.default.rows - 1 || y < 0;
}

exports.unsafe = unsafe;

function grid_x_to_x(x, center) {
  if (center === void 0) {
    center = false;
  }

  return (x + (center ? 0.5 : 0)) * settings_1.default.cell_size + settings_1.default.h_padding;
}

exports.grid_x_to_x = grid_x_to_x;

function grid_y_to_y(y, center) {
  if (center === void 0) {
    center = false;
  }

  return (y + (center ? 0.6 : 0)) * settings_1.default.cell_size + settings_1.default.v_padding;
}

exports.grid_y_to_y = grid_y_to_y;
},{"./settings":"scripts/settings.ts"}],"scripts/settings.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = require("./utils");

var Settings = function () {
  function Settings(canvas) {
    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
    this.canvas_width = 500;
    this.canvas_height = 500;
    this.cell_size = 20;
    this.cols = Math.floor(this.canvas_width / this.cell_size);
    this.rows = Math.floor(this.canvas_height / this.cell_size);
    this.h_padding = utils_1.mod(this.canvas_width, this.cell_size) / 2;
    this.v_padding = utils_1.mod(this.canvas_height, this.cell_size) / 2;
    this.font_size = this.cell_size - 2;
    this.font = this.font_size + "px sans-serif";
    this.text_baseline = "middle";
    this.text_align = "center";
    this.font_color = "rgb(255, 255, 255)";
    this.highlight_fg_color = "rgb(0, 0, 0)";
    this.highlight_bg_color = "rgb(255, 255, 255)";
    this.bg_color = "rgb(0, 0, 0)";
    this.base_glyph = "·";
  }

  Settings.prototype.install = function () {
    this.canvas.width = this.canvas_width;
    this.canvas.height = this.canvas_height;
    this.canvas_context.textBaseline = this.text_baseline;
    this.canvas_context.textAlign = this.text_align;
    this.canvas_context.font = this.font;
  };

  return Settings;
}();

var canvas = document.getElementById("canvas");
var settings = new Settings(canvas);
exports.default = settings;
},{"./utils":"scripts/utils.ts"}],"scripts/grid.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var utils_1 = require("./utils");

var settings_1 = __importDefault(require("./settings"));

var ReferenceGrid = function () {
  function ReferenceGrid(canvas) {
    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
    this.glyph = "·";
    this.width = settings_1.default.canvas_width;
    this.height = settings_1.default.canvas_height;
    this.v_padding = settings_1.default.v_padding;
    this.h_padding = settings_1.default.h_padding;
    this.cols = settings_1.default.cols;
    this.rows = settings_1.default.rows;
  }

  ReferenceGrid.prototype.install = function () {
    this.canvas_context = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };

  ReferenceGrid.prototype.draw = function () {
    for (var x = 0; x < this.cols; x++) {
      for (var y = 0; y < this.rows; y++) {
        this.canvas_context.fillStyle = settings_1.default.bg_color;
        this.canvas_context.fillRect(utils_1.grid_x_to_x(x), utils_1.grid_y_to_y(y), settings_1.default.cell_size, settings_1.default.cell_size);
        this.canvas_context.fillStyle = settings_1.default.font_color;
        this.canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(x, true), utils_1.grid_y_to_y(y, true));
      }
    }
  };

  return ReferenceGrid;
}();

exports.default = ReferenceGrid;
},{"./utils":"scripts/utils.ts","./settings":"scripts/settings.ts"}],"scripts/cursor.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var settings_1 = __importDefault(require("./settings"));

var utils_1 = require("./utils");

var Cursor = function () {
  function Cursor(x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.glyph = "@";
    this.x = x;
    this.y = y;
    window.addEventListener("keydown", this.event_handler(this));
  }

  Cursor.prototype.event_handler = function (binding) {
    return function (e) {
      var key = e.key;

      switch (key) {
        case 'h':
          binding.move_left();
          break;

        case 'l':
          binding.move_right();
          break;

        case 'j':
          binding.move_down();
          break;

        case 'k':
          binding.move_up();
          break;
      }
    };
  };

  Cursor.prototype.move_up = function () {
    this.x = this.x;
    this.y = utils_1.unsafe(this.x, this.y - 1) ? this.y : this.y - 1;
  };

  Cursor.prototype.move_down = function () {
    this.x = this.x;
    this.y = utils_1.unsafe(this.x, this.y + 1) ? this.y : this.y + 1;
  };

  Cursor.prototype.move_left = function () {
    this.x = utils_1.unsafe(this.x - 1, this.y) ? this.x : this.x - 1;
    this.y = this.y;
  };

  Cursor.prototype.move_right = function () {
    this.x = utils_1.unsafe(this.x + 1, this.y) ? this.x : this.x + 1;
    this.y = this.y;
  };

  Cursor.prototype.draw = function () {
    settings_1.default.canvas_context.fillStyle = settings_1.default.highlight_bg_color;
    settings_1.default.canvas_context.fillRect(utils_1.grid_x_to_x(this.x), utils_1.grid_y_to_y(this.y), settings_1.default.cell_size, settings_1.default.cell_size);
    settings_1.default.canvas_context.fillStyle = settings_1.default.highlight_fg_color;
    settings_1.default.canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(this.x, true), utils_1.grid_y_to_y(this.y, true));
  };

  return Cursor;
}();

exports.default = Cursor;
},{"./settings":"scripts/settings.ts","./utils":"scripts/utils.ts"}],"scripts/core.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var settings_1 = __importDefault(require("./settings"));

require("./utils");

var grid_1 = __importDefault(require("./grid"));

var cursor_1 = __importDefault(require("./cursor"));

settings_1.default.install();
var grid_canvas = document.getElementById("grid-canvas");
var grid = new grid_1.default(grid_canvas);
grid.install();
var cursor = new cursor_1.default();

function clear_canvas(canvas_context) {
  canvas_context.clearRect(0, 0, settings_1.default.canvas_width, settings_1.default.canvas_height);
}

grid.draw(); // Draw grid once on background canvas

function draw() {
  clear_canvas(settings_1.default.canvas_context);
  cursor.draw();
  window.requestAnimationFrame(draw);
}

draw();
},{"./settings":"scripts/settings.ts","./utils":"scripts/utils.ts","./grid":"scripts/grid.ts","./cursor":"scripts/cursor.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63546" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/core.ts"], null)
//# sourceMappingURL=/core.55ba2020.js.map