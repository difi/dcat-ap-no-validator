// import Shacl from "./Shacl.js";
import React from 'react';

class ValidationError {

    severity;
    path;
    message;
    targetClass;
    jsonld;
    propertyShape;

    static prefixMap = {
        "http://www.w3.org/ns/shacl#": "sh",
        "http://schema.org/": "schema",
        "http://spdx.org/rdf/terms#": "spdx",
        "http://purl.org/dc/terms/": "dct",
        "http://www.w3.org/ns/adms#": "adms",
        "http://www.w3.org/2002/07/owl#": "owl",
        "http://www.w3.org/2001/XMLSchema#": "xsd",
        "http://www.w3.org/2004/02/skos/core#": "skos",
        "http://www.w3.org/2000/01/rdf-schema#": "rdfs",
        "http://www.w3.org/2006/vcard/ns#": "vcard",
        "http://www.w3.org/ns/dcat#": "dcat",
        "http://xmlns.com/foaf/0.1/": "foaf",
    }


    constructor(propertyShape, message, jsonld) {
        this.severity = propertyShape.severity;
        this.path = propertyShape.path;
        this.message = message;
        this.targetClass = propertyShape.shape.targetClass;
        this.jsonld = jsonld;
        this.propertyShape = propertyShape;
    }

    toJsx() {

        return <div>
            <p><span style={{color: "darkgreen"}}>{ValidationError.prefix(this.jsonld["@id"])}</span> av type <span style={{color: "darkgreen"}}>{ValidationError.prefix(this.targetClass)}</span> med predikat <span style={{color: "darkgreen"}}>{ValidationError.prefix(this.path)}</span> fikk følgende melding:</p>
            <p>{this.message}</p>


        </div>
    }



    static prefix(url){

        Object.keys(ValidationError.prefixMap).forEach(fragment => {
            if(url.indexOf(fragment) === 0){
                url = ValidationError.prefixMap[fragment] + ":"+url.replace(fragment, "");
            }
        });

        return url;
    }

}

export default ValidationError;