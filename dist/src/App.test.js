"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _itIs = require("it-is");

var _itIs2 = _interopRequireDefault(_itIs);

var _RdfToJsonLD = require("./RdfToJsonLD.js");

var _RdfToJsonLD2 = _interopRequireDefault(_RdfToJsonLD);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _Shacl = require("./SHACL/Shacl.js");

var _Shacl2 = _interopRequireDefault(_Shacl);

var _jsonLdHelper = require("./JsonLd/json-ld-helper.js");

var _jsonLdHelper2 = _interopRequireDefault(_jsonLdHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonld = [{
    "@id": "http://example.org/library",
    "@type": ["http://example.org/vocab#Library"],
    "http://example.org/vocab#contains": [{
        "@id": "http://example.org/library/the-republic"
    }]

}, {
    "@id": "http://example.org/library",
    "@type": ["http://example.org/vocab#Library2"],
    "http://example.org/vocab#contains": [{
        "@id": "http://example.org/library/the-republic2"
    }]

}];

var linked = _jsonLdHelper2.default.link(jsonld, true);

console.log(linked);

/*


 fs.readdir("../test-files/", (err, testCases) => {
 // console.log(testCases);
 testCases.forEach(testCase => {
 // console.log(testCase);

 new Promise(function (resolve, reject) {
 fs.readFile("../test-files/" + testCase + "/shacl.ttl", "utf-8", (err, shacl) => {
 RdfToJsonLD
 .rdfToJsonld(shacl).then(jsonld => resolve(jsonld))
 // .catch(error => console.log(error));
 })
 }
 )
 .then(shacl => {

 fs.readdir("../test-files/" + testCase + "/pass", (err, passFiles) => {

 passFiles.forEach(pass => {
 // console.log(pass);

 let shaclValidator = new Shacl(shacl);

 fs.readFile("../test-files/" + testCase + "/pass/" + pass, "utf-8", (err, turtle) => {
 RdfToJsonLD
 .rdfToJsonld(turtle)
 .catch(error => console.error(`Error while reading ${testCase}/pass/${pass}\n`, error))
 .then(jsonld => {

 let valid = true;

 shaclValidator.validate(jsonld, failure => {
 if (failure.severity === Shacl.Violation) {
 valid = false;
 console.log(failure);
 }
 });

 if(!valid){
 console.log("here")
 }
 it(valid).equal(true, `Validation should have passed for: ${testCase}/pass/${pass}`);

 })
 .catch(error => console.error(`Error while reading or validating ${testCase}/pass/${pass}\n`, error));
 });

 });
 });


 fs.readdir("../test-files/" + testCase + "/fail", (err, failFile) => {


 failFile.forEach(fail => {
 let shaclValidator = new Shacl(shacl);

 fs.readFile("../test-files/" + testCase + "/fail/" + fail, "utf-8", (err, turtle) => {
 RdfToJsonLD
 .rdfToJsonld(turtle)
 .catch(error => console.error(`Error while reading ${testCase}/fail/${fail}\n`, error))
 .then(jsonld => {

 let valid = true;

 shaclValidator.validate(jsonld, failure => {
 if (failure.severity === Shacl.Violation) {
 valid = false;
 // console.log(failure);
 }
 });

 it(valid).equal(false, `Validation should have failed for: ${testCase}/fail/${fail}`);

 })
 .catch(error => console.log(`Error while reading or validating ${testCase}/fail/${fail}`, error));
 });
 })
 });


 });


 });
 });
 */
//# sourceMappingURL=App.test.js.map