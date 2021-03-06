var request = require('request'); 
var rootURL = 'https://www.googleapis.com/language/translate/v2';
var defaultLanguages = require('./defaultLangs.js');
var languages = null;
var credentials = null;

module.exports = {
	translate : (text, sourceLanguage, callback) => {
		let translationIteration = (langIter, translationObj) => {
			let currIter = langIter.next();
			if (currIter.done){
				translationObj.sourceLangName = (()=>{
					for (let language of languages.data.languages){
						if (language.language == translationObj.sourceLang){return language.name};
					}
				})()
				callback(translationObj);
			}else{
				let url = rootURL+'?q='+text+'&target='+currIter.value.language+'&key='+credentials.googleTranslate.apiKey;
				if (sourceLanguage != null){
					url += `&source=${sourceLanguage}`;
				}
				let translateReqCallback = (error, response, body) => {
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
				}

				if (sourceLanguage != currIter.value.language) {
					request(encodeURI(url), translateReqCallback);
				}else{
					translateReqCallback(null, {statusCode : 200}, `{"data": {"translations": [{"translatedText": "${text}","detectedSourceLanguage": "${sourceLanguage}"}]}}`);
				}
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
				languages = [];
				console.log(error);
				return false;
			}
		});
	},

	getLanguages : () => {
		return languages.data;
	},

	getDefaultLanguages : () => {
		return defaultLanguages;
	}
}