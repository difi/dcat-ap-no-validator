import MinMaxCountPropertyShape from "./MinMaxCountPropertyShape.js";
import Shacl from "./Shacl.js";
import ValidationError from "./ValidationError.js";


class UniqueLangPropertyShape extends MinMaxCountPropertyShape {

    uniqueLang = false;

    constructor(jsonld, shape) {
        super(jsonld, shape);

        this.uniqueLang = jsonld[Shacl.uniqueLang][0];

    }

    validate(jsonld, failureCallback) {
        super.validate(jsonld, failureCallback);

        if (!this.uniqueLang) return;

        let langMap = {};
        let noLanguage = 0;

        if (jsonld[this.path]) {
            for (let object of jsonld[this.path]) {
                if(object["@language"]){
                    let lang = object["@language"];
                    if(!langMap[lang]){
                        langMap[lang] = 0;
                    }
                    langMap[lang]++;
                }else{
                    noLanguage++;
                }
            }

            if(noLanguage > 1){
                failureCallback(new ValidationError(this, `Forventet maks 1 verdi per språk og fant ${noLanguage} for tomt språk`, jsonld))
            }

            Object.keys(langMap).forEach(key => {
                if(langMap[key] > 1){
                    failureCallback(new ValidationError(this, `Forventet maks 1 verdi per språk og fant ${langMap[key]} for spårk "${key}"`, jsonld))

                }
            })


        }

    }

}

export default UniqueLangPropertyShape;