import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";

import PathPropertyShape from "./PathPropertyShape.js";


class MinMaxCountPropertyShape extends PathPropertyShape {

    minCount = null;
    maxCount = null;


    constructor(jsonld, shape) {
        super(jsonld, shape);
        if (jsonld[Shacl.minCount] !== undefined) {
            this.minCount = jsonld[Shacl.minCount][0];
        }

        if (jsonld[Shacl.maxCount] !== undefined) {
            this.maxCount = jsonld[Shacl.maxCount][0];
        }
    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        let length = 0;
        if (jsonld[this.path] !== undefined) {
            length = jsonld[this.path].length;
        }

        if (this.maxCount && this.minCount && this.minCount == this.minCount && (length < this.minCount || length > this.maxCount)) {
            failureCallback(new ValidationError(this, `Forventet nøyaktig ${this.minCount} forekomst men fant ${length}`, jsonld));
        } else {
            if (this.maxCount && length > this.maxCount) {
                failureCallback(new ValidationError(this, `Forventet maks ${this.maxCount} forekomst men fant ${length}`, jsonld));
            }

            if (this.minCount  && length < this.minCount) {
                failureCallback(new ValidationError(this, `Forventet minst ${this.minCount} forekomst men fant ${length}`, jsonld));
            }
        }


    }

}
export default MinMaxCountPropertyShape;