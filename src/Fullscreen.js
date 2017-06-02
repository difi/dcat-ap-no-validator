import React from 'react';
import Dropzone from 'react-dropzone'
import DcatApNoShacl from './dcat-ap-no-shacl.js'
import Shacl from './SHACL/Shacl.js';
import RdfToJsonLD from "./RdfToJsonLD.js";
import ValidationError from "./SHACL/ValidationError.js";
import 'whatwg-fetch'
import Spinner from 'react-spinner-material';

import JSONLD from 'jsonld'

class Fullscreen extends React.Component {
    constructor() {
        super();
        this.state = {
            accept: '',
            files: [],
            dropzoneActive: false,
            shacl: null,
            validationErrors: [],
            loading: false,
            progress: "0 %",
        }

        this.validate = this.validate.bind(this);
    }

    componentWillMount() {

        let that = this;
        DcatApNoShacl.asJsonLd().then(shacl => {
            that.setState({shacl: new Shacl(shacl)})
        }).catch(err => {
            console.log(err)
        })


    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files) {

        this.setState({
            files,
            dropzoneActive: false,
            validationErrors: []
        });

        this.validate(files[0]);

    }

    validate(file) {
        console.log(file)

        this.setState({syntaxError: null})
        this.setState({loading: true})

        let reader = new FileReader();


        reader.onload = function (e) {
            let text = reader.result;

            let background = function () {

                // let basePath = window.location.host.indexOf("localhost") < 0 ? "dcat-ap-no-validator/" : ""

                let simpleFetch = function(url){
                    return fetch(url)
                        .then(function (response) {
                            return response.json()
                        })
                        .then(jsonld => {
                            return JSONLD.promises.flatten(jsonld).then(JSONLD.promises.expand)
                        })
                };

                let turtleFiles = [
                    simpleFetch("ADMS_SKOS_v1.00.jsonld"),
                    simpleFetch("ADMS_SW_v1-00_Taxonomies.jsonld"),
                    simpleFetch("coporateboadies-skos.jsonld"),
                    simpleFetch("difi-los.jsonld"),
                    simpleFetch("freq.jsonld"),
                    simpleFetch("languages-skos.jsonld"),
                    simpleFetch("cldterms.jsonld"),
                ]

                Promise.all(turtleFiles).then(values => {

                    values.push("");

                    let dcatDataPromise;

                    if (file.name.indexOf(".json") > 0 || file.name.indexOf(".jsonld") > 0) {
                        dcatDataPromise = JSONLD.promises.flatten(JSON.parse(text)).then(JSONLD.promises.expand)
                    } else {
                        dcatDataPromise = RdfToJsonLD.rdfToJsonld(text)
                    }

                    dcatDataPromise
                        .then(jsonld => {

                            values.forEach(value => jsonld = jsonld.concat(value))

                            return jsonld

                        })
                        .then(jsonld => {
                            return JSONLD.promises.flatten(jsonld).then(JSONLD.promises.expand)
                        })
                        .then(jsonld => {

                            this.state.shacl.validate(jsonld, error => {
                                let validationErrors = this.state.validationErrors;
                                validationErrors.push(error);
                                this.setState({validationErrors})
                                this.setState({loading: false})
                            });

                            this.setState({loading: false})

                        })

                        .catch(error => {
                            console.error(error)
                            this.setState({loading: false})
                            this.setState({syntaxError: ":("})
                        })
                })



            }

            background = background.bind(this);
            window.setTimeout(background, 100);


        };

        reader.onload = reader.onload.bind(this);


        reader.readAsText(file);


    }

    applyMimeTypes(event) {
        this.setState({
            accept: event.target.value
        });
    }

    render() {
        const {accept, files, dropzoneActive} = this.state;
        const overlayStyle = {
            position: 'absolute',
            top: 12,
            right: 0,
            bottom: 0,
            left: 12,
            height: 268,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff',
            marginRight: 12,
        };


        console.log(this.state);

        let loading = this.state.loading;

        if (!this.state.shacl) {
            return <h4>Laster</h4>
        }

        let forMangeFiler = files.length > 1

        let syntaxError = this.state.syntaxError;


        let gyldig = files.length === 1 && this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length === 0
        let ikkeGyldig = files.length === 1 && this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length > 0

        if (syntaxError) {
            gyldig = false;
            ikkeGyldig = false;
        }

        let groupedValidationWarnings = {};
        this.state.validationErrors.filter(error => Shacl.Warning == error.severity).forEach(error => {

            if (!groupedValidationWarnings[error.jsonld["@id"]]) {
                groupedValidationWarnings[error.jsonld["@id"]] = {"@type": error.targetClass};
            }
            if (!groupedValidationWarnings[error.jsonld["@id"]][error.path]) {
                groupedValidationWarnings[error.jsonld["@id"]][error.path] = [];
            }
            groupedValidationWarnings[error.jsonld["@id"]][error.path].push(error);

        });


        let groupedValidationViolations = {};
        this.state.validationErrors.filter(error => Shacl.Violation == error.severity).forEach(error => {

            if (!error.jsonld) {
                console.error(error)
                //return;
            }


            if (!groupedValidationViolations[error.jsonld["@id"]]) {
                groupedValidationViolations[error.jsonld["@id"]] = {"@type": error.targetClass};
            }
            if (!groupedValidationViolations[error.jsonld["@id"]][error.path]) {
                groupedValidationViolations[error.jsonld["@id"]][error.path] = [];
            }
            groupedValidationViolations[error.jsonld["@id"]][error.path].push(error);

        });


        return (
            <div style={{marginTop: -10, padding: 10, marginRight: -15, marginLeft: -15, minHeight: 300}}>
                {/*<div className={gyldig ? "faded-green-background" : ikkeGyldig ? "faded-red-background" : ""} style={{marginTop: -10, padding: 10, marginRight: -15, marginLeft: -15, minHeight: 1000}}>*/}

                <div >
                    <Dropzone
                        disableClick
                        style={{border: "dashed"}}
                        accept={accept}
                        onDrop={this.onDrop.bind(this)}
                        onDragEnter={this.onDragEnter.bind(this)}
                        onDragLeave={this.onDragLeave.bind(this)}
                    >
                        { dropzoneActive && <div style={overlayStyle}>Slipp</div> }
                        <div style={{height: 240, width: "100%"}}>

                            <h3 style={{textAlign: "center", paddingTop: 90}}>Slipp en DCAT fil her (turtle eller json-ld)</h3>
                            {forMangeFiler && <h4 style={{textAlign: "center"}}>For mange filer!</h4>}
                            {!loading && gyldig && <h4 style={{textAlign: "center"}} className="green"><span className="lighter-black">"{this.state.files[0].name}"</span> er gyldig <span >✓</span></h4>}
                            {!loading && ikkeGyldig && <h4 style={{textAlign: "center"}} className="red"><span className="lighter-black">"{this.state.files[0].name}"</span> er ikke gyldig <span >✗</span></h4>}
                            {!loading && syntaxError && <h4 style={{textAlign: "center"}} className="red"><span className="lighter-black">"{this.state.files[0].name}"</span> har syntax feil <span >✗</span></h4>}
                            {loading && <h4 style={{textAlign: "center"}}>Validerer <span className="lighter-black">"{this.state.files[0].name}"</span> <Spinner width={20} height={20} spinnerColor={"#333"} spinnerWidth={2} show={true} /></h4>}
                        </div>
                    </Dropzone>
                </div>
                <div>
                    <h2><a className="link" href="#_Avvik" id="_Avvik">Avvik</a></h2>
                    {Object.keys(groupedValidationViolations).map(id =>
                        <RenderError id={id} group={groupedValidationViolations}/>
                    )}
                    {this.state.validationErrors.filter(error => Shacl.Violation == error.severity).length == 0 && <p>Ingen avvik</p>}

                </div>
                <div>
                    <h2><a className="link" href="#_Anbefalinger" id="_Anbefalinger">Anbefalinger</a></h2>
                    {Object.keys(groupedValidationWarnings).map(id =>
                        <RenderError id={id} group={groupedValidationWarnings}/>
                    )}
                    {this.state.validationErrors.filter(error => Shacl.Warning == error.severity).length == 0 && <p>Ingenting å forbedre</p>}

                    {/*<ul>*/}
                    {/*{this.state.validationErrors.filter(error => Shacl.Warning == error.severity).map((error, index) => <RenderError error={error} key={index}/>)}*/}
                    {/*</ul>*/}
                </div>

            </div>
        )
            ;
    }
}

class RenderError extends React.Component {


    render() {

        let id = this.props.id;
        let group = this.props.group;

        return <span>
            <h4>Ressurs <span style={{color: "darkgreen"}}>{id}</span></h4>
                            <h6>Type: <span style={{color: "darkgreen"}}>{ValidationError.prefix(group[id]["@type"])}</span></h6>
                            <ul>
                                {Object.keys(group[id])
                                    .filter(predikat => !predikat.indexOf("@") == 0)
                                    .map(predikat =>
                                        <li style={{listStyle: "none"}}>
                                            <div>
                                                <h7 style={{color: "darkgreen"}}>{ValidationError.prefix(predikat)}</h7>

                                                <ul>
                                                    {Object.values(group[id][predikat]).map(error => {
                                                            return <li style={{listStyle: "none"}}>{error.message}</li>
                                                        }
                                                    )}
                                                </ul>

                                            </div>
                                        </li>
                                    )}
                            </ul>
            <hr/>
                        </span>;


    }


}

export default Fullscreen;