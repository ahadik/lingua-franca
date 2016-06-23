export default class Input{
	constructor(textField, submitButton, callback){
		submitButton.addEventListener('click', (e) => {
			let that = this;
			e.preventDefault();

			let xhr = new XMLHttpRequest();
			xhr.open('POST', 'translate', true);
			//Send the proper header information along with the request
			xhr.setRequestHeader("Content-type", "application/json");
			xhr.send(JSON.stringify({'text' : textField.value}));
			xhr.onload = function(oEvent) {
				if (xhr.status == 200) {
					console.log(that);
					let data = that.analyzeResults(JSON.parse( xhr.responseText));
					this.results = data;
					callback(data);
					console.log("Finished");
				} else {
					console.log("error translating");
				}
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
			return translation;
		});

		body.removeChild(measureSpan);
		return translateData;
	}
}