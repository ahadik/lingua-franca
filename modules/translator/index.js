var request = require('request'); 
var rootURL = 'https://www.googleapis.com/language/translate/v2';
var languages = null;
var credentials = null;

module.exports = {
	translate : (text, callback) => {
		let translationIteration = (langIter, translationObj) => {
			let currIter = langIter.next();
			if (currIter.done){
				translationObj.sourceLangName = (()=>{
					for (let language of languages.data.languages){
						console.log(language);
						if (language.language == translationObj.sourceLang){return language.name};
					}
				})()
				callback(translationObj);
			}else{
				request(encodeURI(rootURL+'?q='+text+'&target='+currIter.value.language+'&key='+credentials.googleTranslate.apiKey), function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let translatedText= JSON.parse(body);
						for (let translation of translatedText.data.translations) {
							translation.langName = currIter.value.name;
							translation.language = currIter.value.language;
							translationObj.sourceLang = translation.detectedSourceLanguage;
							translationObj.translations.push(translation);
						}
						translationIteration(langIter, translationObj);
					}
				});
			}
		};
		translationIteration(languages.data.languages[Symbol.iterator](), {translations : [], sourceLang : null})
	},
	install : (creds) => {
		credentials = creds;
		request(encodeURI(rootURL+'/languages?key='+credentials.googleTranslate.apiKey+'&target=en'), (error, response, body) => {
			if (!error && response.statusCode == 200) {
				languages = JSON.parse(body);
				console.log("Ready to translate!");
			}else{
				console.log(error);
				return false;
			}
		});
	}
}