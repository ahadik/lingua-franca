import Row from './Row.js';

export default class Data{
	constructor(){
		this.set = false;
		this.translations = {};
		this.rows = [];
		[...document.querySelectorAll('.langCheckBox')].forEach((checkbox) => {
			this.translations[checkbox.id] = {active : checkbox.checked ? true : false};
		});
	}

	setData(data){
		this.set = true;
		this.sourceLang = data.sourceLang;
		let inputLangStatus = document.querySelector('#inputLanguage');
		inputLangStatus.classList.remove('card__dropdown--detecting');
		inputLangStatus.classList.add('card__dropdown--postload');
		inputLangStatus.querySelector('.dropdown').value = data.sourceLang;
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

		/*
			<div class="column__data-header" id="longerLangData">
				<span class="column__data-header--small column__data-header--content"><span class="numLangs column__data-header--numlangs"></span> longer</span>
				<span class="column__data-header--large column__data-header--content" id="percentLongerLangs"></span>
			</div>
			<div class="column__data-header" id="shorterLangData">
				<span class="column__data-header--small column__data-header--content" id="percentLongerLangs"><span class="numLangs column__data-header--numlangs"></span> shorter</span>
				<span class="column__data-header--large column__data-header--content"></span>
			</div>
		*/

		let createDataColumn = () => {
			let columnWrapper = document.createElement('div');
			columnWrapper.classList.add('table__column--1-sixth');
			columnWrapper.classList.add('column__gradient-data');
			columnWrapper.id = 'gradientDataColumn';
			columnWrapper.innerHTML = '<div class="column__data-header" id="longerLangData">' +
				'<span class="column__data-header--small column__data-header--content"><span class="column__data-header--numlangs" id="longerNumLangs"></span> longer</span>' +
				'<span class="column__data-header--small column__data-header--content" id="longerWordsPercent"></span>' +
			'</div>' +
			'<div class="column__data-header" id="shorterLangData">' +
				'<span class="column__data-header--small column__data-header--content"><span class="column__data-header--numlangs" id="shorterNumLangs"></span> shorter</span>' +
				'<span class="column__data-header--small column__data-header--content" id="shorterWordsPercent"></span>' +
			'</div>';
			return columnWrapper;
		}

		this.rows = [];
		for (let lang in this.translations) {
			if (this.translations.hasOwnProperty(lang) && this.translations[lang].active){
				let translationRow = document.createElement('div');
				translationRow.classList.add('table__row');

				translationRow.appendChild(createLangColumn(lang, this.translations[lang].langName));
				translationRow.appendChild(createTranslationColumn(lang, this.translations[lang].translatedText));
				if (lang == this.sourceLang){
					translationRow.classList.add('table__row--highlight');
					translationRow.appendChild(createDataColumn());
				}
				let row = new Row(translationRow, this.translations[lang].width, this.translations[lang].langName, this.translations[lang].language);
				this.rows.push(row);
			}
		}

		this.sortRows('width', false);
	}

	renderData(){

		let langData = document.querySelector('#dataLangElems');
		let gradientColumn = document.querySelector('#gradientColumn');

		langData.innerHTML = '';
		langData.appendChild(gradientColumn);

		let direction = parseInt(document.querySelector('#dataTranslationHeader').getAttribute('data-direction'));

		let beforeCount = 0;
		let afterCount = 0;
		let totalCount = this.rows.length;
		let currCount = 0;
		this.rows.forEach((rowObject) => {
			if (rowObject.languageID == this.sourceLang) {
				beforeCount = currCount;
				currCount = 0;
			}
			currCount += 1;
			langData.appendChild(rowObject.domElement);
		});
		afterCount = currCount;

		if (document.querySelector('.column__data-header')){
			//shorter first
			if (direction){
				document.querySelector('#gradientDataColumn').classList.add('column__gradient-data--reverse');

				document.querySelector('#longerLangData').classList.remove('column__gradient-data--first');
				document.querySelector('#longerLangData').classList.add('column__gradient-data--last');
				document.querySelector('#shorterLangData').classList.add('column__gradient-data--first');
				document.querySelector('#shorterLangData').classList.remove('column__gradient-data--last');

				document.querySelector('#shorterWordsPercent').innerHTML = `${Math.round(beforeCount/totalCount*100)}%`;
				document.querySelector('#longerWordsPercent').innerHTML = `${Math.round(afterCount/totalCount*100)}%`;
				document.querySelector('#shorterNumLangs').innerHTML = beforeCount+' ';
				document.querySelector('#longerNumLangs').innerHTML = (afterCount-1)+' ';
				
			//longer first
			}else{
				document.querySelector('#gradientDataColumn').classList.remove('column__gradient-data--reverse');

				document.querySelector('#longerLangData').classList.remove('column__gradient-data--last');
				document.querySelector('#longerLangData').classList.add('column__gradient-data--first');
				document.querySelector('#shorterLangData').classList.add('column__gradient-data--last');
				document.querySelector('#shorterLangData').classList.remove('column__gradient-data--first');

				document.querySelector('#longerWordsPercent').innerHTML = `${Math.round(beforeCount/totalCount*100)}%`;
				document.querySelector('#shorterWordsPercent').innerHTML = `${Math.round(afterCount/totalCount*100)}%`;
				document.querySelector('#longerNumLangs').innerHTML = beforeCount+' ';
				document.querySelector('#shorterNumLangs').innerHTML = (afterCount-1)+' ';
			}
		}

		let dataCard = document.querySelector('#langDataCard')
		if (dataCard.classList.contains('card--hidden')){
			dataCard.classList.remove('card--hidden');
		}
	}
}