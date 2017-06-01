import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";


class DatatypePropertyShape extends MinMaxCountPropertyShape {

    datatype = null;

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.datatype = jsonld[Shacl.datatype][0]["@id"];

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        if (jsonld[this.path]) {
            for (let object of jsonld[this.path]) {
                if (object["@type"] === undefined) {
                    failureCallback(new ValidationError(this, `No datatype found, should be ${this.datatype}`, jsonld))
                }
                if (object["@type"] !== this.datatype) {
                    failureCallback(new ValidationError(this, `Forventet datatype ${this.datatype} med fant ${object["@type"]}`, jsonld))
                }
            }
        }

    }

}

export default DatatypePropertyShape;