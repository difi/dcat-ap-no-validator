import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";


class InPropertyShape extends MinMaxCountPropertyShape {

    in = null;
    inIdMap = {};
    inLiteralMap = {
        datatype: {},
        language: {},
        plain: {},

    };

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.in = jsonld[Shacl.in][0]["@list"];

        this.in
            .forEach(object => {
                if (!object["@id"]) {
                    object = object.jsonld;
                }

                if (object["@id"]) {
                    this.inIdMap[object["@id"]] = object;
                } else if (object["@type"]) {
                    if (!this.inLiteralMap.datatype[object["@type"]]) {
                        this.inLiteralMap.datatype[object["@type"]] = {};
                    }
                    this.inLiteralMap.datatype[object["@type"]][object["@value"]] = object;
                } else if (object["@language"]) {
                    if (!this.inLiteralMap.language[object["@language"]]) {
                        this.inLiteralMap.language[object["@language"]] = {};
                    }
                    this.inLiteralMap.language[object["@language"]][object["@value"]] = object;
                } else {
                    this.inLiteralMap.plain[object["@value"]] = object;
                }

            })

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        if (jsonld[this.path]) {
            jsonld[this.path].forEach(object => {
                try {
                    if (object["@id"]) {
                        if (!this.inIdMap[object["@id"]]) {
                            failureCallback(new ValidationError(this, `Fant ${object["@id"]}, men forventet en av [ ${this.in.map(a => a["@id"]).reduce((a, b) => a + ", " + b)} ]`, jsonld));
                        }
                    } else if (object["@type"]) {
                        let res = false;
                        try {
                            res = this.inLiteralMap.datatype[object["@type"]][object["@value"]];
                        } catch (err) {
                        }

                        if (!res) {
                            failureCallback(new ValidationError(this, `Fant Fant "${object["@value"]}"^^<${object["@type"]}>, men forventet en av [ ${this.in.map(a => a["@id"]).reduce((a, b) => a + ", " + b)} ]`, jsonld));
                        }
                    } else if (object["@language"]) {
                        let res = false;
                        try {
                            res = this.inLiteralMap.language[object["@language"]][object["@value"]];
                        } catch (err) {
                        }
                        if (!res) {
                            failureCallback(new ValidationError(this, `Fant "${object["@value"]}"@${object["@language"]}, men forventet en av [ ${this.in.map(a => a["@id"]).reduce((a, b) => a + ", " + b)} ]`, jsonld));
                        }
                    } else {
                        let res = this.inLiteralMap.plain[object["@value"]];
                        if (!res) {
                            failureCallback(new ValidationError(this, `Fant "${object["@value"]}", men forventet en av [ ${this.in.map(a => a["@id"]).reduce((a, b) => a + ", " + b)} ]`, jsonld));
                        }
                    }
                } catch (err) {
                    if (err.name === "TypeError") {
                        failureCallback(new ValidationError(this, `Forventet en av [ ${this.in.map(a => a["@id"]).reduce((a, b) => a + ", " + b)} ]`, jsonld));
                    } else {
                        throw err;
                    }
                }
            })
        }


    }
}

export default InPropertyShape;