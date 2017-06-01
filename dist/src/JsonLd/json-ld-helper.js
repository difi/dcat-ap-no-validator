'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jsonld = require('jsonld');

var _jsonld2 = _interopRequireDefault(_jsonld);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JsonLdhelper = function () {
    function JsonLdhelper() {
        _classCallCheck(this, JsonLdhelper);
    }

    _createClass(JsonLdhelper, null, [{
        key: 'typeIndex',
        value: function typeIndex(jsonld) {

            var typeIndex = {};
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = jsonld[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var resource = _step.value;

                    var typeList = resource["@type"];
                    if (typeList !== undefined) {
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = typeList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var type = _step2.value;

                                if (typeIndex[type] === undefined) {
                                    typeIndex[type] = [];
                                }

                                typeIndex[type].push(resource);
                            }
                        } catch (err) {
                            _didIteratorError2 = true;
                            _iteratorError2 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }
                            } finally {
                                if (_didIteratorError2) {
                                    throw _iteratorError2;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return typeIndex;
        }
    }, {
        key: 'link',
        value: function link(json, compactLiterals) {

            var jsonld = {};

            var bnodeCounter = -1;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = json[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var resource = _step3.value;

                    var id = resource['@id'];
                    if (id !== undefined && id.indexOf("_:b") === 0) {
                        var temp = parseInt(id.replace("_:b", ""), 10);
                        if (bnodeCounter < temp) {
                            bnodeCounter = temp;
                        }
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = json[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _resource = _step4.value;


                    if (_resource['@id'] === undefined) {
                        _resource['@id'] = "_:b" + bnodeCounter++;
                    }

                    jsonld[_resource['@id']] = _resource;
                    _resource.reverse = {};
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = json[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _resource2 = _step5.value;

                    for (var property in _resource2) {

                        if (_resource2[property].constructor === Array) {
                            for (var index in _resource2[property]) {
                                _resource2[property][index] = JsonLdhelper.linkObjectsAndCompactLiterals(_resource2[property][index], property, _resource2, compactLiterals, jsonld);

                                if (_resource2[property][index]["@list"] !== undefined) {
                                    for (var listIndex in _resource2[property][index]["@list"]) {
                                        _resource2[property][index]["@list"][listIndex] = JsonLdhelper.linkObjectsAndCompactLiterals(_resource2[property][index]["@list"][listIndex], property, _resource2, compactLiterals, jsonld);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return jsonld;
        }
    }, {
        key: 'linkObjectsAndCompactLiterals',
        value: function linkObjectsAndCompactLiterals(resourceObject, property, resource, compactLiterals, jsonld) {
            var id = resourceObject["@id"];
            if (id !== undefined && jsonld[id] !== undefined) {
                resourceObject = jsonld[id];

                if (jsonld[id].reverse[property] === undefined) {
                    jsonld[id].reverse[property] = [];
                }

                // Comment this line if you want to printout for test, it creates cycle reference on json data
                jsonld[id].reverse[property].push(resource);
            }

            // Support for labels, language etc.  Set compactLitterals to false if you want to turn it off
            if (compactLiterals) {
                if (resourceObject["@type"] !== undefined) {
                    var type = resourceObject["@type"];
                    if (type === "http://www.w3.org/2001/XMLSchema#date" || type === "http://www.w3.org/2001/XMLSchema#dateTime") {
                        resourceObject["@value"] = (0, _moment2.default)(resourceObject["@value"]);
                    } else if (type === "http://www.w3.org/2001/XMLSchema#integer") {
                        resourceObject["@value"] = parseInt(resourceObject["@value"], 10);
                    } else {
                        // console.log("HERE: " + type);
                    }
                }

                if (resourceObject["@value"] !== undefined) {
                    var temp = resourceObject;
                    resourceObject = resourceObject["@value"];
                    if (typeof resourceObject === "string") {
                        resourceObject = new String(resourceObject);
                    }
                    if (typeof resourceObject === "number") {
                        resourceObject = new Number(resourceObject);
                    }
                    // resourceObject.prototype.getJsonLdObject = function () {
                    //     return temp;
                    // };

                    resourceObject.jsonld = temp;
                }
            }
            return resourceObject;
        }
    }]);

    return JsonLdhelper;
}();

exports.default = JsonLdhelper;
//# sourceMappingURL=json-ld-helper.js.map