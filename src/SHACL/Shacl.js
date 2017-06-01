import Shape from "./Shape.js";
import JsonLdhelper from "../JsonLd/json-ld-helper.js";

class Shacl {

    shapes = [];

    static ns = "http://www.w3.org/ns/shacl#";
    static Shape = Shacl.ns + "Shape";
    static minCount = Shacl.ns + "minCount";
    static maxCount = Shacl.ns + "maxCount";
    static targetClass = Shacl.ns + "targetClass";
    static property = Shacl.ns + "property";
    static nodeKind = Shacl.ns + "nodeKind";
    static path = Shacl.ns + "path";
    static severity = Shacl.ns + "severity";
    static datatype = Shacl.ns + "datatype";
    static class = Shacl.ns + "class";
    static in = Shacl.ns + "in";
    static uniqueLang = Shacl.ns + "uniqueLang";

    static or = Shacl.ns + "or";
    static Violation = Shacl.ns + "Violation";
    static Warning = Shacl.ns + "Warning";

    static Literal = Shacl.ns + "Literal";
    static BlankNodeOrIRI = Shacl.ns + "BlankNodeOrIRI";
    static IRI = Shacl.ns + "IRI";


    constructor(jsonld) {

        JsonLdhelper.link(jsonld, true);
        let typeIndex = JsonLdhelper.typeIndex(jsonld);

        for (let shape of typeIndex[Shacl.Shape]) {
            this.shapes.push(new Shape(shape));
        }

    }

    validate(jsonld, failureCallback, progress) {
        JsonLdhelper.link(jsonld, false);
        let typeIndex = JsonLdhelper.typeIndex(jsonld);

        this.shapes.forEach(shape => {
            shape.validate(typeIndex[shape.targetClass], failureCallback)
        });

    }

}

export default Shacl;