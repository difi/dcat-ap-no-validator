import Shacl from "./Shacl.js";
import BasePropertyShape from "./BasePropertyShape.js";


class PathPropertyShape extends BasePropertyShape {

    path = null;

    constructor(jsonld, shape) {
        super(jsonld, shape);
        if (jsonld[Shacl.path] !== undefined) {
            this.path = jsonld[Shacl.path][0]["@id"];
        }

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);
    }


}

export default PathPropertyShape;