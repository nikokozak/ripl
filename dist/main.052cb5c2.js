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
  function Settings() {
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

  Settings.prototype.install = function (canvases) {
    for (var _i = 0, canvases_1 = canvases; _i < canvases_1.length; _i++) {
      var canvas = canvases_1[_i];
      var canvas_context = canvas.getContext('2d');
      canvas.width = this.canvas_width;
      canvas.height = this.canvas_height;
      canvas_context.textBaseline = this.text_baseline;
      canvas_context.textAlign = this.text_align;
      canvas_context.font = this.font;
    }
  };

  return Settings;
}();

var settings = new Settings();
exports.default = settings;
},{"./utils":"scripts/utils.ts"}],"scripts/reference-grid.ts":[function(require,module,exports) {
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

  ReferenceGrid.prototype.draw = function () {
    this.canvas_context.clearRect(0, 0, this.width, this.height);

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
},{"./utils":"scripts/utils.ts","./settings":"scripts/settings.ts"}],"scripts/operators.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.library = exports.EastOp = exports.WestOp = exports.SouthOp = exports.NorthOp = void 0;

var settings_1 = __importDefault(require("./settings"));

var utils_1 = require("./utils"); // Controller for all of our Operators.


var Operators = function () {
  function Operators(canvas) {
    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
    this.store = Array(settings_1.default.cols * settings_1.default.rows);
  }

  Operators.prototype.write = function (glyph, x, y) {
    this.store[this.index_at(x, y)] = new exports.library[glyph](x, y);
    console.log(this.store);
  };

  Operators.prototype.erase = function (x, y) {
    this.store[this.index_at(x, y)] = undefined;
  };

  Operators.prototype.draw = function () {
    this.canvas_context.clearRect(0, 0, settings_1.default.canvas_width, settings_1.default.canvas_height);

    for (var _i = 0, _a = this.store; _i < _a.length; _i++) {
      var operator = _a[_i];
      if (operator) operator.draw(this.canvas_context);
    }
  }; // Helpers


  Operators.prototype.at = function (x, y) {
    return this.store.find(function (op) {
      return op.x == x && op.y == y;
    });
  };

  Operators.prototype.index_at = function (x, y) {
    return y * settings_1.default.cols + x;
  };

  return Operators;
}();

exports.default = Operators;

var Entity = function () {
  function Entity(glyph, x, y) {
    this.x = x;
    this.y = y;
    this.glyph = glyph;
  }

  Entity.prototype.draw_glyph = function (canvas_context) {
    canvas_context.fillStyle = settings_1.default.bg_color;
    canvas_context.fillRect(utils_1.grid_x_to_x(this.x), utils_1.grid_y_to_y(this.y), settings_1.default.cell_size, settings_1.default.cell_size);
    canvas_context.fillStyle = settings_1.default.font_color;
    canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(this.x, true), utils_1.grid_y_to_y(this.y, true));
  };

  return Entity;
}();

var LineOp = function (_super) {
  __extends(LineOp, _super);

  function LineOp(glyph, x, y) {
    var _this = _super.call(this, glyph, x, y) || this;

    _this.commands = [];
    return _this;
  }

  LineOp.prototype.draw = function (canvas_context) {
    this.draw_glyph(canvas_context);

    for (var cI = 0; cI + 1 < this.commands.length; cI++) {
      var command = this.commands[cI];
      var next_command = this.commands[cI + 1];
      canvas_context.beginPath();
      canvas_context.moveTo(utils_1.grid_x_to_x(command.x, true), utils_1.grid_y_to_y(command.y, true));
      canvas_context.lineTo(utils_1.grid_x_to_x(next_command.x, true), utils_1.grid_y_to_y(next_command.y, true));
      canvas_context.strokeStyle = settings_1.default.font_color;
      canvas_context.stroke();
    }
  };

  return LineOp;
}(Entity);

var NorthOp = function (_super) {
  __extends(NorthOp, _super);

  function NorthOp(x, y) {
    var _this = _super.call(this, "N", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: _this.x,
      y: 0
    }];
    return _this;
  }

  return NorthOp;
}(LineOp);

exports.NorthOp = NorthOp;

var SouthOp = function (_super) {
  __extends(SouthOp, _super);

  function SouthOp(x, y) {
    var _this = _super.call(this, "S", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: _this.x,
      y: settings_1.default.rows - 1
    }];
    return _this;
  }

  return SouthOp;
}(LineOp);

exports.SouthOp = SouthOp;

var WestOp = function (_super) {
  __extends(WestOp, _super);

  function WestOp(x, y) {
    var _this = _super.call(this, "W", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: 0,
      y: _this.y
    }];
    return _this;
  }

  return WestOp;
}(LineOp);

exports.WestOp = WestOp;

var EastOp = function (_super) {
  __extends(EastOp, _super);

  function EastOp(x, y) {
    var _this = _super.call(this, "E", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: settings_1.default.cols - 1,
      y: _this.y
    }];
    return _this;
  }

  return EastOp;
}(LineOp);

exports.EastOp = EastOp;
exports.library = {
  "N": NorthOp,
  "S": SouthOp,
  "W": WestOp,
  "E": EastOp
};
},{"./settings":"scripts/settings.ts","./utils":"scripts/utils.ts"}],"scripts/cursor.ts":[function(require,module,exports) {
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
  function Cursor(canvas, x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
    this.glyph = "@";
    this.x = x;
    this.y = y;

    var default_fn = function default_fn(_x, _y) {}; // ADD NEW EVENT NAMES HERE, MAKE SURE TO ADD THEM TO THE SWITCH CASE AS WELL!:


    var event_names = ['move_left', 'move_right', 'move_up', 'move_down', 'n', 's', 'e', 'w', 'x']; // Register event_names as object { event_name: default_fn }

    this.events = event_names.reduce(function (prev, curr, _i) {
      console.log(prev);
      prev[curr] = default_fn;
      return prev;
    }, {});
    window.addEventListener("keydown", this.event_handler(this));
  }

  Cursor.prototype.on = function (event, assoc_fun) {
    if (event in this.events) {
      this.events[event] = assoc_fun;
    } else {
      throw new EvalError("Event " + event + " does not exist in cursor");
    }
  };

  Cursor.prototype.event_handler = function (binding) {
    return function (e) {
      var key = e.key;

      switch (key) {
        case 'h':
          binding.move_left();
          binding.events['move_left'](binding.x, binding.y);
          break;

        case 'l':
          binding.move_right();
          binding.events['move_right'](binding.x, binding.y);
          break;

        case 'j':
          binding.move_down();
          binding.events['move_down'](binding.x, binding.y);
          break;

        case 'k':
          binding.move_up();
          binding.events['move_up'](binding.x, binding.y);
          break;

        case 'n':
          binding.events['n'](binding.x, binding.y);
          break;

        case 's':
          binding.events['s'](binding.x, binding.y);
          break;

        case 'e':
          binding.events['e'](binding.x, binding.y);
          break;

        case 'w':
          binding.events['w'](binding.x, binding.y);
          break;

        case 'x':
          binding.events['x'](binding.x, binding.y);
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
    this.canvas_context.clearRect(0, 0, settings_1.default.canvas_width, settings_1.default.canvas_height);
    this.canvas_context.fillStyle = settings_1.default.highlight_bg_color;
    this.canvas_context.fillRect(utils_1.grid_x_to_x(this.x), utils_1.grid_y_to_y(this.y), settings_1.default.cell_size, settings_1.default.cell_size);
    this.canvas_context.fillStyle = settings_1.default.highlight_fg_color;
    this.canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(this.x, true), utils_1.grid_y_to_y(this.y, true));
  };

  return Cursor;
}();

exports.default = Cursor;
},{"./settings":"scripts/settings.ts","./utils":"scripts/utils.ts"}],"scripts/ripl.ts":[function(require,module,exports) {
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

var reference_grid_1 = __importDefault(require("./reference-grid"));

var operators_1 = __importDefault(require("./operators"));

var cursor_1 = __importDefault(require("./cursor"));

var grid_canvas = document.getElementById('grid-canvas');
var operator_canvas = document.getElementById('operator-canvas');
var cursor_canvas = document.getElementById('cursor-canvas');

var Ripl = function () {
  function Ripl() {
    var _this = this;

    this.modifiers = []; // modifiers modify operators.

    settings_1.default.install([grid_canvas, operator_canvas, cursor_canvas]);
    this.grid = new reference_grid_1.default(grid_canvas);
    this.operators = new operators_1.default(operator_canvas);
    this.cursor = new cursor_1.default(cursor_canvas); // Cursor / keyboard listeners

    this.cursor.on('n', function (x, y) {
      return _this.operators.write("N", x, y);
    });
    this.cursor.on('s', function (x, y) {
      return _this.operators.write("S", x, y);
    });
    this.cursor.on('e', function (x, y) {
      return _this.operators.write("E", x, y);
    });
    this.cursor.on('w', function (x, y) {
      return _this.operators.write("W", x, y);
    });
    this.cursor.on('x', function (x, y) {
      return _this.operators.erase(x, y);
    });
  }

  Ripl.prototype.draw = function () {
    this.grid.draw();
    this.operators.draw();
    this.cursor.draw();
  };

  return Ripl;
}();

exports.default = Ripl;
},{"./settings":"scripts/settings.ts","./reference-grid":"scripts/reference-grid.ts","./operators":"scripts/operators.ts","./cursor":"scripts/cursor.ts"}],"scripts/main.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ripl_1 = __importDefault(require("./ripl"));

var ripl = new ripl_1.default();

function draw() {
  ripl.draw();
  window.requestAnimationFrame(draw);
}

draw();
},{"./ripl":"scripts/ripl.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/main.ts"], null)
//# sourceMappingURL=/main.052cb5c2.js.map