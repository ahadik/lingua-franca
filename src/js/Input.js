export default class Input{
	constructor(textField, submitButton, callback){
		submitButton.addEventListener('click', (e) => {
			submitButton.classList.add('translation-input__button--loading');
			let that = this;
			e.preventDefault();

			let xhr = new XMLHttpRequest();
			xhr.open('POST', 'translate', true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify({'text' : textField.value}));
			xhr.onload = function(oEvent) {
				if (xhr.status == 200) {
					let data = that.analyzeResults(JSON.parse( xhr.responseText));
					this.results = data;
					callback(data);
					console.log("Finished");
				} else {
					console.log("error translating");
				}
				submitButton.classList.remove('translation-input__button--loading');
			};
		});
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
		translateData.translations.sort((a, b)=>{return a.width - b.width});
		body.removeChild(measureSpan);
		return translateData;
	}
}