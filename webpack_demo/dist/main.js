
!function (modules) {
  function require(id) {
    const [fn, mapping] = modules[id]

    function localRequire(relativePath) {
      return require(mapping[relativePath])
    }

    const module = {
      exports: {}
    }

    fn(localRequire, module, module.exports)

    return module.exports
  }

  require(0)
}({
  0: [
    function (require, module, exports) {
      "use strict";

      var _info = _interopRequireDefault(require("./info.js"));

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

      var str = require('./com.js');

      console.log(str);
      console.log(_info["default"]);
    },
    { "./com.js": 1, "./info.js": 2 }
  ],

  1: [
    function (require, module, exports) {
      "use strict";

      var str = '测试commonjs';
      module.exports = str;
    },
    {}
  ],

  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports["default"] = void 0;

      var _utils = require("./utils.js");

      console.log((0, _utils.add)(1, 3));

      var _default = "\u6B22\u8FCE\u6765\u5230".concat(_utils.name, ", \u6211\u4EEC\u4E00\u8D77\u6574\u4E2Awebpack");

      exports["default"] = _default;
    },
    { "./utils.js": 3 }
  ],

  3: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.add = add;
      exports.name = void 0;
      var name = 'ark';
      exports.name = name;

      function add(num1, num2) {
        return num1 + num2;
      }
    },
    {}
  ],
})
