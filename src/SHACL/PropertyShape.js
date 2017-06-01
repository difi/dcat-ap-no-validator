import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import NodeKindPropertyShape from "./NodeKindPropertyShape.js";
import DatatypePropertyShape from "./DatatypePropertyShape.js";
import ClassPropertyShape from "./ClassPropertyShape.js";
import OrPropertyShape from "./OrPropertyShape.js";
import InPropertyShape from "./InPropertyShape.js";
import UniqueLangPropertyShape from "./UniqueLangPropertyShape.js";


import Shacl from "./Shacl.js";

class PropertyShape {


    static getInstance(jsonld, shape) {


        if (jsonld[Shacl.datatype] !== undefined) {
            return new DatatypePropertyShape(jsonld, shape);
        }

        if (jsonld[Shacl.class] !== undefined) {
            return new ClassPropertyShape(jsonld, shape);
        }

        if (jsonld[Shacl.or] !== undefined) {
            return new OrPropertyShape(jsonld, shape);
        }


        if (jsonld[Shacl.nodeKind] !== undefined) {
            return new NodeKindPropertyShape(jsonld, shape);
        }


        if (jsonld[Shacl.in] !== undefined) {
            return new InPropertyShape(jsonld, shape);
        }

        if (jsonld[Shacl.uniqueLang] !== undefined) {
            return new UniqueLangPropertyShape(jsonld, shape);
        }

        if (jsonld[Shacl.minCount] !== undefined) {
            return new MinMaxCountPropertyShape(jsonld, shape);
        }

        if (jsonld[Shacl.maxCount] !== undefined) {
            return new MinMaxCountPropertyShape(jsonld, shape);
        }


        throw "Unknown shape";


    }

}

export default PropertyShape;