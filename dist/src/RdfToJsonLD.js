"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rdf = require("rdf");

var _rdf2 = _interopRequireDefault(_rdf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RdfToJsonLD = function () {
    function RdfToJsonLD() {
        _classCallCheck(this, RdfToJsonLD);
    }

    _createClass(RdfToJsonLD, null, [{
        key: "convertRdfListToArray",
        value: function convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex) {

            var list = [];

            var node = tempJsonLd[subject[predicate][objectIndex]["@id"]];

            while (node !== undefined) {

                list.push(node["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"][0]);

                node = tempJsonLd[node["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"][0]["@id"]];
            }

            subject[predicate][objectIndex] = { "@list": list };
        }
    }, {
        key: "rdfToJsonld",
        value: function rdfToJsonld(rdfText) {
            return new Promise(function (resolve, reject) {

                var env = _rdf2.default.environment;

                function expand(value) {
                    if (value.indexOf(':') < 0 || value.indexOf("//") >= 0) return value.toString();
                    return env.resolve(value) || value.toString();
                };

                // rdf.setBuiltins();

                console.log("start parse");

                var graph = env.createGraph();
                var turtleParser = new _rdf2.default.TurtleParser();
                turtleParser.parse(rdfText, function () {

                    console.log("done parsing");
                    var tempJsonLd = {};

                    graph.forEach(function (triple) {
                        // triple.subject.nominalValue = triple.subject.nominalValue.resolve();
                        if (triple.subject.nodeType() === "BlankNode" && triple.subject.nominalValue.indexOf("_:") < 0) {
                            triple.subject.nominalValue = "_:" + triple.subject.nominalValue;
                        }
                        // triple.predicate.nominalValue = triple.predicate.nominalValue.resolve();

                        if (!tempJsonLd[triple.subject.nominalValue]) {
                            tempJsonLd[triple.subject.nominalValue] = { "@id": triple.subject.nominalValue };
                        }

                        if (triple.predicate.nominalValue === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                            if (!tempJsonLd[triple.subject.nominalValue]["@type"]) {
                                tempJsonLd[triple.subject.nominalValue]["@type"] = [];
                            }

                            tempJsonLd[triple.subject.nominalValue]["@type"].push(triple.object.nominalValue);
                        }

                        if (!tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue]) {
                            tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue] = [];
                        }

                        var object = {};

                        var type = triple.object.nodeType();

                        if (type === "IRI") {
                            object["@id"] = triple.object.nominalValue;
                        } else if (type === "BlankNode") {
                            if (triple.object.nominalValue.indexOf("_:") < 0) {
                                object["@id"] = "_:" + triple.object.nominalValue;
                            } else {
                                object["@id"] = triple.object.nominalValue;
                            }
                        } else {
                            object["@value"] = triple.object.nominalValue;
                            if (triple.object.datatype) {

                                var resolvedDatatype = expand(triple.object.datatype);
                                object["@type"] = resolvedDatatype;
                            }
                            if (triple.object.language) {
                                object["@language"] = triple.object.language;
                            }
                        }

                        tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue].push(object);
                    });

                    console.log("built jsonld");

                    Object.keys(tempJsonLd).map(function (key) {
                        return tempJsonLd[key];
                    }).filter(function (subject) {
                        return subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined;
                    }).forEach(function (subject) {

                        Object.keys(subject).filter(function (predicate) {
                            return Array.isArray(subject[predicate]);
                        }).forEach(function (predicate) {
                            for (var objectIndex in subject[predicate]) {
                                var object = subject[predicate][objectIndex];
                                if (object["@id"] === undefined) continue;

                                if (tempJsonLd[object["@id"]] !== undefined && tempJsonLd[object["@id"]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] !== undefined) {
                                    RdfToJsonLD.convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex);
                                }
                            }
                        });
                    });

                    var realJsonLd = [];

                    Object.keys(tempJsonLd).filter(function (key) {
                        return tempJsonLd[key]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined;
                    }).forEach(function (key) {
                        return realJsonLd.push(tempJsonLd[key]);
                    });

                    console.log("done with list");

                    resolve(realJsonLd);
                }, "", null, graph);
            });
        }
    }]);

    return RdfToJsonLD;
}();

exports.default = RdfToJsonLD;
//# sourceMappingURL=RdfToJsonLD.js.map