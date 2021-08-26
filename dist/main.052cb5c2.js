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
exports.clone = exports.range = exports.grid_y_to_y = exports.grid_x_to_x = exports.unsafe = exports.mod = void 0;

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

function range(start, end) {
  var result = Array(Math.abs(end - start));
  var result_index = 0;
  if (start == end) return [start];

  while (start != end) {
    result[result_index++] = start < end ? start++ : start--;
  }

  return result;
}

exports.range = range;

function clone(obj_or_array) {
  return JSON.parse(JSON.stringify(obj_or_array));
}

exports.clone = clone;
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
    this.line_width = 5;
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
},{"./utils":"scripts/utils.ts","./settings":"scripts/settings.ts"}],"scripts/commander/commands/command.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var settings_1 = __importDefault(require("../../settings"));

var utils_1 = require("../../utils");

var Command = function () {
  function Command(glyph, x, y) {
    this.x = x;
    this.y = y;
    this.glyph = glyph;
  }

  Command.prototype.draw_glyph = function (canvas_context) {
    canvas_context.fillStyle = settings_1.default.bg_color;
    canvas_context.fillRect(utils_1.grid_x_to_x(this.x), utils_1.grid_y_to_y(this.y), settings_1.default.cell_size, settings_1.default.cell_size);
    canvas_context.fillStyle = settings_1.default.font_color;
    canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(this.x, true), utils_1.grid_y_to_y(this.y, true));
  };

  Command.prototype.draw = function (canvas_context) {
    this.draw_glyph(canvas_context);
  };

  Command.prototype.scan = function (_modifiers) {
    return null;
  };

  Command.prototype.refresh = function (_modifiers) {
    return null;
  };

  return Command;
}();

exports.default = Command;
},{"../../settings":"scripts/settings.ts","../../utils":"scripts/utils.ts"}],"scripts/commander/modifiers/modifier.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var settings_1 = __importDefault(require("../../settings"));

var utils_1 = require("../../utils");

var Modifier = function () {
  function Modifier(glyph, x, y) {
    this.x = x;
    this.y = y;
    this.glyph = glyph;
  }

  Modifier.prototype.draw = function (canvas_context) {
    canvas_context.fillStyle = settings_1.default.bg_color;
    canvas_context.fillRect(utils_1.grid_x_to_x(this.x), utils_1.grid_y_to_y(this.y), settings_1.default.cell_size, settings_1.default.cell_size);
    canvas_context.fillStyle = settings_1.default.font_color;
    canvas_context.fillText(this.glyph, utils_1.grid_x_to_x(this.x, true), utils_1.grid_y_to_y(this.y, true));
  };

  Modifier.prototype.modify = function (commands, _instruction_index) {
    return commands;
  };

  return Modifier;
}();

exports.default = Modifier;
},{"../../settings":"scripts/settings.ts","../../utils":"scripts/utils.ts"}],"scripts/commander/modifiers/lines.ts":[function(require,module,exports) {
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
exports.WestLine = exports.EastLine = exports.SouthLine = exports.NorthLine = exports.StopLine = void 0;

var modifier_1 = __importDefault(require("./modifier"));

var settings_1 = __importDefault(require("../../settings")); // Stop a line


var StopLine = function (_super) {
  __extends(StopLine, _super);

  function StopLine(x, y) {
    return _super.call(this, "x", x, y) || this;
  }

  StopLine.prototype.modify = function (commands, instruction_index) {
    var new_commands = commands.slice(0, instruction_index + 1);
    new_commands.push({
      x: this.x,
      y: this.y
    });
    return new_commands;
  };

  return StopLine;
}(modifier_1.default);

exports.StopLine = StopLine;

var NorthLine = function (_super) {
  __extends(NorthLine, _super);

  function NorthLine(x, y) {
    return _super.call(this, "n", x, y) || this;
  }

  NorthLine.prototype.modify = function (commands, instruction_index) {
    var new_commands = commands.slice(0, instruction_index + 1);
    new_commands.push({
      x: this.x,
      y: this.y
    });
    new_commands.push({
      x: this.x,
      y: 0
    });
    return new_commands;
  };

  return NorthLine;
}(modifier_1.default);

exports.NorthLine = NorthLine;

var SouthLine = function (_super) {
  __extends(SouthLine, _super);

  function SouthLine(x, y) {
    return _super.call(this, "s", x, y) || this;
  }

  SouthLine.prototype.modify = function (commands, instruction_index) {
    var new_commands = commands.slice(0, instruction_index + 1);
    new_commands.push({
      x: this.x,
      y: this.y
    });
    new_commands.push({
      x: this.x,
      y: settings_1.default.rows - 1
    });
    return new_commands;
  };

  return SouthLine;
}(modifier_1.default);

exports.SouthLine = SouthLine;

var EastLine = function (_super) {
  __extends(EastLine, _super);

  function EastLine(x, y) {
    return _super.call(this, "e", x, y) || this;
  }

  EastLine.prototype.modify = function (commands, instruction_index) {
    var new_commands = commands.slice(0, instruction_index + 1);
    new_commands.push({
      x: this.x,
      y: this.y
    });
    new_commands.push({
      x: settings_1.default.cols - 1,
      y: this.y
    });
    return new_commands;
  };

  return EastLine;
}(modifier_1.default);

exports.EastLine = EastLine;

var WestLine = function (_super) {
  __extends(WestLine, _super);

  function WestLine(x, y) {
    return _super.call(this, "w", x, y) || this;
  }

  WestLine.prototype.modify = function (commands, instruction_index) {
    var new_commands = commands.slice(0, instruction_index + 1);
    new_commands.push({
      x: this.x,
      y: this.y
    });
    new_commands.push({
      x: 0,
      y: this.y
    });
    return new_commands;
  };

  return WestLine;
}(modifier_1.default);

exports.WestLine = WestLine;
},{"./modifier":"scripts/commander/modifiers/modifier.ts","../../settings":"scripts/settings.ts"}],"scripts/commander/accepts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lines = require("./modifiers/lines");

var _default = {
  Line: [_lines.StopLine, _lines.NorthLine, _lines.SouthLine, _lines.EastLine, _lines.WestLine]
};
exports.default = _default;
},{"./modifiers/lines":"scripts/commander/modifiers/lines.ts"}],"scripts/commander/commands/lines.ts":[function(require,module,exports) {
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
exports.EastLine = exports.WestLine = exports.SouthLine = exports.NorthLine = void 0;

var command_1 = __importDefault(require("./command"));

var accepts_1 = __importDefault(require("../accepts"));

var utils_1 = require("../../utils");

var settings_1 = __importDefault(require("../../settings"));

var Line = function (_super) {
  __extends(Line, _super);

  function Line(glyph, x, y) {
    var _this = _super.call(this, glyph, x, y) || this;

    _this.commands = [];
    _this._commands = []; // Keep originals

    _this.accepts = accepts_1.default.Line;
    return _this;
  }

  Line.prototype.draw = function (canvas_context) {
    //const modded_commands = this.modify(this.commands);
    for (var cI = 0; cI + 1 < this.commands.length; cI++) {
      var command = this.commands[cI];
      var next_command = this.commands[cI + 1];
      canvas_context.beginPath();
      canvas_context.moveTo(utils_1.grid_x_to_x(command.x, true), utils_1.grid_y_to_y(command.y, true));
      canvas_context.lineTo(utils_1.grid_x_to_x(next_command.x, true), utils_1.grid_y_to_y(next_command.y, true));
      canvas_context.strokeStyle = settings_1.default.font_color;
      canvas_context.lineWidth = settings_1.default.line_width;
      canvas_context.stroke();
    }

    this.draw_glyph(canvas_context);
  };

  Line.prototype.interact = function (unvetted_modifiers) {
    this.modifiers = [];
    var index = 0;

    while (index < this.commands.length - 1) {
      var collision = this.collision_at_cmd_index(index, unvetted_modifiers);

      if (collision && !this.modifiers.includes(collision) && this.compatible(collision)) {
        this.modifiers.push(collision);
        this.commands = collision.modify(this.commands, index);
        console.log("collided with " + collision.glyph);
      }

      index++;
    }
  }; // At a given command index, returns the nearest collision between the command at the given index and the next command.


  Line.prototype.collision_at_cmd_index = function (command_index, modifiers) {
    if (command_index == this.commands.length - 1) {
      return false;
    }

    var cX = this.commands[command_index].x;
    var cY = this.commands[command_index].y;
    var cX1 = this.commands[command_index + 1].x;
    var cY1 = this.commands[command_index + 1].y;
    var collision_range_x = utils_1.range(Math.min(cX, cX1), Math.max(cX, cX1));
    var collision_range_y = utils_1.range(Math.min(cY, cY1), Math.max(cY, cY1));
    var collisions_at_curr_index = modifiers.filter(function (modifier) {
      return modifier && collision_range_x.includes(modifier.x) && collision_range_y.includes(modifier.y) && (modifier.x != cX || modifier.y != cY);
    });
    var nearest_collider = collisions_at_curr_index.sort(function (m1, m2) {
      var m1_diff = Math.abs(m1.x - cX) + Math.abs(m1.y - cY);
      var m2_diff = Math.abs(m2.x - cX) + Math.abs(m2.y - cY);
      return m1_diff - m2_diff;
    })[0];
    return nearest_collider ? nearest_collider : false;
  };

  Line.prototype.refresh = function (modifiers) {
    this.commands = utils_1.clone(this._commands);
    this.interact(modifiers);
  }; // Check if the given operator is present in our "accepts" array.


  Line.prototype.compatible = function (modifier) {
    return this.accepts.find(function (acceptable) {
      return modifier instanceof acceptable;
    }) ? true : false;
  };

  return Line;
}(command_1.default);

exports.default = Line;

var NorthLine = function (_super) {
  __extends(NorthLine, _super);

  function NorthLine(x, y) {
    var _this = _super.call(this, "N", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: _this.x,
      y: 0
    }];
    _this._commands = utils_1.clone(_this.commands);
    return _this;
  }

  return NorthLine;
}(Line);

exports.NorthLine = NorthLine;

var SouthLine = function (_super) {
  __extends(SouthLine, _super);

  function SouthLine(x, y) {
    var _this = _super.call(this, "S", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: _this.x,
      y: settings_1.default.rows - 1
    }];
    _this._commands = utils_1.clone(_this.commands);
    return _this;
  }

  return SouthLine;
}(Line);

exports.SouthLine = SouthLine;

var WestLine = function (_super) {
  __extends(WestLine, _super);

  function WestLine(x, y) {
    var _this = _super.call(this, "W", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: 0,
      y: _this.y
    }];
    _this._commands = utils_1.clone(_this.commands);
    return _this;
  }

  return WestLine;
}(Line);

exports.WestLine = WestLine;

var EastLine = function (_super) {
  __extends(EastLine, _super);

  function EastLine(x, y) {
    var _this = _super.call(this, "E", x, y) || this;

    _this.commands = [{
      x: _this.x,
      y: _this.y
    }, {
      x: settings_1.default.cols - 1,
      y: _this.y
    }];
    _this._commands = utils_1.clone(_this.commands);
    return _this;
  }

  return EastLine;
}(Line);

exports.EastLine = EastLine;
},{"./command":"scripts/commander/commands/command.ts","../accepts":"scripts/commander/accepts.js","../../utils":"scripts/utils.ts","../../settings":"scripts/settings.ts"}],"scripts/commander/glyph_mappings.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lines = require("./commands/lines");

var _lines2 = require("./modifiers/lines");

var _default = {
  "N": _lines.NorthLine,
  "n": _lines2.NorthLine,
  "S": _lines.SouthLine,
  "s": _lines2.SouthLine,
  "W": _lines.WestLine,
  "w": _lines2.WestLine,
  "E": _lines.EastLine,
  "e": _lines2.EastLine,
  "x": _lines2.StopLine
};
exports.default = _default;
},{"./commands/lines":"scripts/commander/commands/lines.ts","./modifiers/lines":"scripts/commander/modifiers/lines.ts"}],"scripts/commander/commander.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var settings_1 = __importDefault(require("../settings"));

var glyph_mappings_1 = __importDefault(require("./glyph_mappings"));

var command_1 = __importDefault(require("./commands/command"));

var modifier_1 = __importDefault(require("./modifiers/modifier")); // Controller for all of our Commander.


var Commander = function () {
  function Commander(canvas) {
    this.canvas = canvas;
    this.canvas_context = canvas.getContext('2d');
    this.commands = Array(settings_1.default.cols * settings_1.default.rows);
    this.modifiers = Array(settings_1.default.cols * settings_1.default.rows);
  }

  Commander.prototype.write = function (glyph, x, y) {
    var new_entity = new glyph_mappings_1.default[glyph](x, y);

    if (new_entity instanceof modifier_1.default) {
      this.modifiers[this.index_at(x, y)] = new_entity;
      this.commands[this.index_at(x, y)] = undefined;
    } else if (new_entity instanceof command_1.default) {
      this.commands[this.index_at(x, y)] = new_entity;
      this.modifiers[this.index_at(x, y)] = undefined;
    }

    this.refresh();
  };

  Commander.prototype.erase = function (x, y) {
    this.commands[this.index_at(x, y)] = undefined;
    this.modifiers[this.index_at(x, y)] = undefined;
  };

  Commander.prototype.draw = function () {
    this.canvas_context.clearRect(0, 0, settings_1.default.canvas_width, settings_1.default.canvas_height);

    for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
      var command = _a[_i];
      if (command) command.draw(this.canvas_context);
    }

    for (var _b = 0, _c = this.modifiers; _b < _c.length; _b++) {
      var modifier = _c[_b];
      if (modifier) modifier.draw(this.canvas_context);
    }
  };

  Commander.prototype.refresh = function () {
    for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
      var command = _a[_i];
      if (command instanceof command_1.default) command.refresh(this.modifiers);
    }
  }; // Helpers


  Commander.prototype.at = function (x, y) {
    return this.commands.find(function (op) {
      return op.x == x && op.y == y;
    });
  };

  Commander.prototype.index_at = function (x, y) {
    return y * settings_1.default.cols + x;
  };

  return Commander;
}();

exports.default = Commander;
},{"../settings":"scripts/settings.ts","./glyph_mappings":"scripts/commander/glyph_mappings.js","./commands/command":"scripts/commander/commands/command.ts","./modifiers/modifier":"scripts/commander/modifiers/modifier.ts"}],"scripts/cursor.ts":[function(require,module,exports) {
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


    var event_names = ['move_left', 'move_right', 'move_up', 'move_down', 'Backspace', 'N', 'S', 'E', 'W', 'n', 's', 'e', 'w', 'x']; // Register event_names as object { event_name: default_fn }

    this.events = event_names.reduce(function (prev, curr, _i) {
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

        case 'N':
          binding.events['N'](binding.x, binding.y);
          break;

        case 'n':
          binding.events['n'](binding.x, binding.y);
          break;

        case 'S':
          binding.events['S'](binding.x, binding.y);
          break;

        case 's':
          binding.events['s'](binding.x, binding.y);
          break;

        case 'E':
          binding.events['E'](binding.x, binding.y);
          break;

        case 'e':
          binding.events['e'](binding.x, binding.y);
          break;

        case 'W':
          binding.events['W'](binding.x, binding.y);
          break;

        case 'w':
          binding.events['w'](binding.x, binding.y);
          break;

        case 'x':
          binding.events['x'](binding.x, binding.y);
          break;

        case 'Backspace':
          binding.events['Backspace'](binding.x, binding.y);
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

var commander_1 = __importDefault(require("./commander/commander"));

var cursor_1 = __importDefault(require("./cursor"));

var grid_canvas = document.getElementById('grid-canvas');
var commander_canvas = document.getElementById('commander-canvas');
var cursor_canvas = document.getElementById('cursor-canvas');

var Ripl = function () {
  function Ripl() {
    var _this = this;

    settings_1.default.install([grid_canvas, commander_canvas, cursor_canvas]);
    this.grid = new reference_grid_1.default(grid_canvas);
    this.commander = new commander_1.default(commander_canvas);
    this.cursor = new cursor_1.default(cursor_canvas); // Cursor / keyboard listeners

    this.cursor.on('N', function (x, y) {
      return _this.commander.write("N", x, y);
    });
    this.cursor.on('n', function (x, y) {
      return _this.commander.write("n", x, y);
    });
    this.cursor.on('S', function (x, y) {
      return _this.commander.write("S", x, y);
    });
    this.cursor.on('s', function (x, y) {
      return _this.commander.write("s", x, y);
    });
    this.cursor.on('E', function (x, y) {
      return _this.commander.write("E", x, y);
    });
    this.cursor.on('e', function (x, y) {
      return _this.commander.write("e", x, y);
    });
    this.cursor.on('W', function (x, y) {
      return _this.commander.write("W", x, y);
    });
    this.cursor.on('w', function (x, y) {
      return _this.commander.write("w", x, y);
    });
    this.cursor.on('Backspace', function (x, y) {
      _this.commander.erase(x, y);

      _this.commander.refresh();
    });
    this.cursor.on('x', function (x, y) {
      return _this.commander.write("x", x, y);
    });
  }

  Ripl.prototype.draw = function () {
    this.grid.draw();
    this.commander.draw();
    this.cursor.draw();
  };

  return Ripl;
}();

exports.default = Ripl;
},{"./settings":"scripts/settings.ts","./reference-grid":"scripts/reference-grid.ts","./commander/commander":"scripts/commander/commander.ts","./cursor":"scripts/cursor.ts"}],"scripts/main.ts":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59722" + '/');

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