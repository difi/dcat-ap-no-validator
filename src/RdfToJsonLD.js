import rdf from "rdf";

class RdfToJsonLD {


    static convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex) {

        let list = [];

        let node = tempJsonLd[subject[predicate][objectIndex]["@id"]];

        while (node !== undefined) {

            list.push(node["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"][0]);

            node = tempJsonLd[node["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"][0]["@id"]];


        }

        subject[predicate][objectIndex] = {"@list": list};


    }


    static rdfToJsonld(rdfText) {
        return new Promise(function (resolve, reject) {


            const env = rdf.environment;

            function expand(value) {
                if(value.indexOf(':')<0 || value.indexOf("//")>=0 ) return value.toString();
                return env.resolve(value)||value.toString();
            };

            // rdf.setBuiltins();

            console.log("start parse")

            let graph = env.createGraph();
            let turtleParser = new rdf.TurtleParser();
            turtleParser.parse(rdfText, function () {

                console.log("done parsing")
                let tempJsonLd = {};

                graph.forEach(triple => {
                    // triple.subject.nominalValue = triple.subject.nominalValue.resolve();
                    if(triple.subject.nodeType() === "BlankNode" && triple.subject.nominalValue.indexOf("_:") < 0){
                        triple.subject.nominalValue = "_:"+triple.subject.nominalValue;

                    }
                    // triple.predicate.nominalValue = triple.predicate.nominalValue.resolve();

                    if (!tempJsonLd[triple.subject.nominalValue]) {
                        tempJsonLd[triple.subject.nominalValue] = {"@id": triple.subject.nominalValue};
                    }

                    if (triple.predicate.nominalValue === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                        if (!tempJsonLd[triple.subject.nominalValue]["@type"]) {
                            tempJsonLd[triple.subject.nominalValue]["@type"] = [];
                        }

                        tempJsonLd[triple.subject.nominalValue]["@type"].push(triple.object.nominalValue);


                    }

                    if (!tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue]) {
                        tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue] = [];
                    }

                    let object = {};

                    let type = triple.object.nodeType();


                    if (type === "IRI") {
                        object["@id"] = triple.object.nominalValue;
                    } else if(type === "BlankNode"){
                        if(triple.object.nominalValue.indexOf("_:") < 0){
                            object["@id"] = "_:"+triple.object.nominalValue;
                        }else{
                            object["@id"] = triple.object.nominalValue;

                        }
                    } else {
                        object["@value"] = triple.object.nominalValue;
                        if (triple.object.datatype) {

                            let resolvedDatatype =expand(triple.object.datatype);
                            object["@type"] = resolvedDatatype;

                        }
                        if (triple.object.language) {
                            object["@language"] = triple.object.language;
                        }
                    }


                    tempJsonLd[triple.subject.nominalValue][triple.predicate.nominalValue].push(object);


                });

                console.log("built jsonld")

                Object
                    .keys(tempJsonLd)
                    .map(key => tempJsonLd[key])
                    .filter(subject => subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined)
                    .forEach(subject => {

                        Object.keys(subject)
                            .filter(predicate => Array.isArray(subject[predicate]))
                            .forEach(predicate => {
                                for (let objectIndex in subject[predicate]) {
                                    let object = subject[predicate][objectIndex];
                                    if (object["@id"] === undefined) continue;

                                    if (tempJsonLd[object["@id"]] !== undefined && tempJsonLd[object["@id"]]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] !== undefined) {
                                        RdfToJsonLD.convertRdfListToArray(tempJsonLd, subject, predicate, objectIndex);
                                    }

                                }


                            })
                    });


                let realJsonLd = [];

                Object.keys(tempJsonLd)
                    .filter(key => tempJsonLd[key]["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"] === undefined)
                    .forEach(key => realJsonLd.push(tempJsonLd[key]));

                console.log("done with list")


                resolve(realJsonLd);

            }, "", null, graph);



        });
    }

}




export default RdfToJsonLD;