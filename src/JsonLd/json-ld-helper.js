import moment from 'moment';
import JSONLD from 'jsonld';


class JsonLdhelper {


    static typeIndex(jsonld) {

        let typeIndex = {};
        for (let resource of jsonld) {
            let typeList = resource["@type"];
            if (typeList !== undefined) {
                for (let type of typeList) {
                    if (typeIndex[type] === undefined) {
                        typeIndex[type] = [];
                    }

                    typeIndex[type].push(resource);
                }
            }

        }

        return typeIndex;


    }

    static link(json, compactLiterals) {





        let jsonld = {}

        let bnodeCounter = -1;


        for (let resource of json) {
            let id = resource['@id'];
            if (id !== undefined && id.indexOf("_:b") === 0) {
                let temp = parseInt(id.replace("_:b", ""), 10);
                if (bnodeCounter < temp) {
                    bnodeCounter = temp;
                }
            }
        }


        for (let resource of json) {

            if(resource['@id'] === undefined){
                resource['@id'] = "_:b"+(bnodeCounter++);
            }

            jsonld[resource['@id']] = resource;
            resource.reverse = {};
        }


        for (let resource of json) {
            for (let property in resource) {

                if (resource[property].constructor === Array) {
                    for (let index in resource[property]) {
                        resource[property][index] = JsonLdhelper.linkObjectsAndCompactLiterals(resource[property][index], property, resource, compactLiterals, jsonld);

                        if (resource[property][index]["@list"] !== undefined) {
                            for (let listIndex in resource[property][index]["@list"]) {
                                resource[property][index]["@list"][listIndex] = JsonLdhelper.linkObjectsAndCompactLiterals(resource[property][index]["@list"][listIndex], property, resource, compactLiterals, jsonld);
                            }
                        }
                    }
                }

            }
        }


        return jsonld;


    }

    static  linkObjectsAndCompactLiterals(resourceObject, property, resource, compactLiterals, jsonld) {
        let id = resourceObject["@id"];
        if (id !== undefined && jsonld[id] !== undefined) {
            resourceObject = jsonld[id];

            if (jsonld[id].reverse[property] === undefined) {
                jsonld[id].reverse[property] = [];
            }

            // Comment this line if you want to printout for test, it creates cycle reference on json data
            jsonld[id].reverse[property].push(resource);

        }

        // Support for labels, language etc.  Set compactLitterals to false if you want to turn it off
        if (compactLiterals) {
            if (resourceObject["@type"] !== undefined) {
                let type = resourceObject["@type"];
                if (type === "http://www.w3.org/2001/XMLSchema#date" || type === "http://www.w3.org/2001/XMLSchema#dateTime") {
                    resourceObject["@value"] = moment(resourceObject["@value"]);
                } else if (type === "http://www.w3.org/2001/XMLSchema#integer") {
                    resourceObject["@value"] = parseInt(resourceObject["@value"], 10);
                } else {
                    // console.log("HERE: " + type);
                }


            }

            if (resourceObject["@value"] !== undefined) {
                let temp = resourceObject;
                resourceObject = resourceObject["@value"];
                if (typeof resourceObject === "string") {
                    resourceObject = new String(resourceObject);
                }
                if (typeof resourceObject === "number") {
                    resourceObject = new Number(resourceObject);
                }
                // resourceObject.prototype.getJsonLdObject = function () {
                //     return temp;
                // };

                resourceObject.jsonld = temp;


            }
        }
        return resourceObject;
    }


}

export default JsonLdhelper;