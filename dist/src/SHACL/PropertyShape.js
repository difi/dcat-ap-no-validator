"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MinMaxCountPropertyShape = require("./MinMaxCountPropertyShape.js");

var _MinMaxCountPropertyShape2 = _interopRequireDefault(_MinMaxCountPropertyShape);

var _NodeKindPropertyShape = require("./NodeKindPropertyShape.js");

var _NodeKindPropertyShape2 = _interopRequireDefault(_NodeKindPropertyShape);

var _DatatypePropertyShape = require("./DatatypePropertyShape.js");

var _DatatypePropertyShape2 = _interopRequireDefault(_DatatypePropertyShape);

var _ClassPropertyShape = require("./ClassPropertyShape.js");

var _ClassPropertyShape2 = _interopRequireDefault(_ClassPropertyShape);

var _OrPropertyShape = require("./OrPropertyShape.js");

var _OrPropertyShape2 = _interopRequireDefault(_OrPropertyShape);

var _InPropertyShape = require("./InPropertyShape.js");

var _InPropertyShape2 = _interopRequireDefault(_InPropertyShape);

var _UniqueLangPropertyShape = require("./UniqueLangPropertyShape.js");

var _UniqueLangPropertyShape2 = _interopRequireDefault(_UniqueLangPropertyShape);

var _Shacl = require("./Shacl.js");

var _Shacl2 = _interopRequireDefault(_Shacl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PropertyShape = function () {
    function PropertyShape() {
        _classCallCheck(this, PropertyShape);
    }

    _createClass(PropertyShape, null, [{
        key: "getInstance",
        value: function getInstance(jsonld, shape) {

            if (jsonld[_Shacl2.default.datatype] !== undefined) {
                return new _DatatypePropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.class] !== undefined) {
                return new _ClassPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.or] !== undefined) {
                return new _OrPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.nodeKind] !== undefined) {
                return new _NodeKindPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.in] !== undefined) {
                return new _InPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.uniqueLang] !== undefined) {
                return new _UniqueLangPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.minCount] !== undefined) {
                return new _MinMaxCountPropertyShape2.default(jsonld, shape);
            }

            if (jsonld[_Shacl2.default.maxCount] !== undefined) {
                return new _MinMaxCountPropertyShape2.default(jsonld, shape);
            }

            throw "Unknown shape";
        }
    }]);

    return PropertyShape;
}();

exports.default = PropertyShape;
//# sourceMappingURL=PropertyShape.js.map