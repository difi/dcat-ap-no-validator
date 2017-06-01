import Shacl from "./Shacl.js";
import PropertyShape from "./PropertyShape.js";

class Shape {

    targetClass = null;
    property = [];


    constructor(jsonld) {
        if (jsonld[Shacl.targetClass] !== undefined) {
            this.targetClass = jsonld[Shacl.targetClass][0]["@id"];
        }

        if (jsonld[Shacl.property] !== undefined) {
            this.property = jsonld[Shacl.property].map(property => {
                return PropertyShape.getInstance(property, this)
            });
        }
    }

    validate(jsonld, failureCallback) {

        if (jsonld === undefined) return;

        for (let resource of jsonld) {
            this.property.forEach(propertyShape => propertyShape.validate(resource, failureCallback));
        }


    }

}

export default Shape;