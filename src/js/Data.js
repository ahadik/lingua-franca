import Row from './Row.js';

export default class Data{
	constructor(){
		this.set = false;
		this.translations = {};
		this.rows = [];
		[...document.querySelectorAll('.langCheckBox')].forEach((checkbox) => {
			this.translations[checkbox.id] = {active : checkbox.hasAttribute('checked') ? true : false};
		});
	}

	setData(data){
		this.set = true;
		this.sourceLang = data.sourceLang;
		document.querySelector('#inputLanguage').innerHTML = data.sourceLangName;
		data.translations.forEach(translation => {
			this.translations[translation.language]['langName'] = translation.langName;
			this.translations[translation.language]['translatedText'] = translation.translatedText;
			this.translations[translation.language]['width'] = translation.width;
			this.translations[translation.language]['language'] = translation.language;
		});
	}

	sortRows(parameter, ascending) {
		if (parameter == 'width') {
			this.rows.sort((a, b) => {return Row.compareWidth(a, b, ascending)});
		}else if (parameter == 'language'){
			this.rows.sort((a, b) => {return Row.compareLanguage(a, b, ascending)});
		}
	}

	setRows(){
		let createTextSpan = (text) => {
			let span = document.createElement('span');
			span.innerHTML = text;
			return span;
		}

		let createLangColumn = (lang, language) => {
			let translationLang = document.createElement('div');
			translationLang.classList.add('table__column--2-sixth');
			translationLang.classList.add('languageColumn');
			translationLang.appendChild(createTextSpan(language));
			return translationLang;
		}

		let createTranslationColumn = (lang, translatedText) => {
			let translationString = document.createElement('div');
			translationString.classList.add('table__column--3-sixth');
			translationString.classList.add('textColumn');
			translationString.appendChild(createTextSpan(translatedText));
			return translationString;
		}

		this.rows = [];
		for (let lang in this.translations) {
			if (this.translations.hasOwnProperty(lang) && this.translations[lang].active){
				let translationRow = document.createElement('div');
				translationRow.classList.add('table__row');

				if (lang == this.sourceLang){
					translationRow.classList.add('table__row--highlight');
				}
				translationRow.appendChild(createLangColumn(lang, this.translations[lang].langName));
				translationRow.appendChild(createTranslationColumn(lang, this.translations[lang].translatedText));
				let row = new Row(translationRow, this.translations[lang].width, this.translations[lang].langName, this.translations[lang].language);
				this.rows.push(row);
			}
		}

		this.sortRows('width', false);
	}

	renderData(){

		let langData = document.querySelector('#dataLangElems');
		langData.innerHTML = '';

		let direction = parseInt(document.querySelector('#dataTranslationHeader').getAttribute('data-direction'));

		let beforeCount = 0;
		let afterCount = 0;
		let totalCount = this.rows.length;
		let currCount = 0;
		this.rows.forEach((rowObject) => {
			//console.log(rowObject.languageID);
			//console.log(this.sourceLang);
			if (rowObject.languageID == this.sourceLang) {
				beforeCount = currCount;
				currCount = 0;
			}
			currCount += 1;
			langData.appendChild(rowObject.domElement);
		});
		afterCount = currCount;

		if (direction){
			document.querySelector('#gradientDataColumn').classList.add('column__gradient-data--reverse');
			document.querySelector('.column__data-header:last-of-type .column__data-header--large').innerHTML = `${Math.round(beforeCount/totalCount*100)}%`;
			document.querySelector('.column__data-header:first-of-type .column__data-header--large').innerHTML = `${Math.round(afterCount/totalCount*100)}%`;
			document.querySelector('.column__data-header:last-of-type .numLangs').innerHTML = beforeCount;
			document.querySelector('.column__data-header:first-of-type .numLangs').innerHTML = afterCount;
			
		}else{
			document.querySelector('#gradientDataColumn').classList.remove('column__gradient-data--reverse');
			document.querySelector('.column__data-header:first-of-type .column__data-header--large').innerHTML = `${Math.round(beforeCount/totalCount*100)}%`;
			document.querySelector('.column__data-header:last-of-type .column__data-header--large').innerHTML = `${Math.round(afterCount/totalCount*100)}%`;
			document.querySelector('.column__data-header:first-of-type .numLangs').innerHTML = beforeCount;
			document.querySelector('.column__data-header:last-of-type .numLangs').innerHTML = afterCount;
		}

		let dataCard = document.querySelector('#langDataCard')
		if (dataCard.classList.contains('card--hidden')){
			dataCard.classList.remove('card--hidden');
		}
	}
}