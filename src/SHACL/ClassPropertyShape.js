import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";
import React from 'react';


class ClassPropertyShape extends MinMaxCountPropertyShape {

    class = null;

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.class = jsonld[Shacl.class][0]["@id"];

    }


    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        if(jsonld[this.path]){
            jsonld[this.path]



                 .filter(object => !(object["@type"] && object["@type"].includes(this.class))).forEach(object => {

                failureCallback(new ValidationError(this, `Forventet at ${object["@id"]} skulle være av type ${ValidationError.prefix(this.class)}`, jsonld));

            })
        }


    }

}

export default ClassPropertyShape;