export default class Input{
	constructor(textField, submitButton, callback){
		this.textField = textField;
		this.submitButton = submitButton;
		this.submitButton.addEventListener('click', (e) => {
			let inputLangStatus = document.querySelector('#inputLanguage')
			inputLangStatus.classList.remove('card__dropdown--onload');
			inputLangStatus.classList.add('card__dropdown--detecting');
			e.preventDefault();
			this.triggerRequest(callback, document.querySelector('#inputLanguageSelector').value);
		});
	}

	triggerRequest(callback, setLang){
		this.submitButton.classList.add('card__text-submit--loading');
		let that = this;
		let xhr = new XMLHttpRequest();
		xhr.open('POST', `translate${(setLang != '') && (setLang != undefined) ? '?lang='+setLang : ''}`, true);
		//Send the proper header information along with the request
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(JSON.stringify({'text' : this.textField.value}));
		xhr.onload = function(oEvent) {
			if (xhr.status == 200) {
				let data = that.analyzeResults(JSON.parse( xhr.responseText));
				callback(data);
			} else {
				console.log("error translating");
			}
			that.submitButton.classList.remove('card__text-submit--loading');
		};
	}

	analyzeResults(translateData){
		let measureSpan = document.createElement('span');
		measureSpan.classList.add('translate-text__measure');
		let body = document.querySelector('body');
		body.appendChild(measureSpan);

		translateData.translations = translateData.translations.map((translation) => {
			measureSpan.innerHTML = translation.translatedText;
			let wordWidth = measureSpan.offsetWidth;
			translation.width = wordWidth;
			if (translation.language == translateData.sourceLang){
				translateData.sourceWidth = wordWidth;
			}
			return translation;
		});
		body.removeChild(measureSpan);
		return translateData;
	}
}