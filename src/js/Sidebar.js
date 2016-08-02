import Cookie from './Cookie.js';

export default class Sidebar{

	constructor(sidebarDOM){
		this.savedLangs = [];
		let langCookie = JSON.parse(Cookie.readCookie('languages'));
		this.langCheckBoxes = [...document.querySelectorAll('.langCheckBox')];
		if (langCookie){
			this.savedLangs = langCookie;
			this.langCheckBoxes.forEach((checkbox) => {
				checkbox.checked = false;
			});

			this.savedLangs.forEach((lang) => {
				document.querySelector(`#${lang}`).checked = true;
			});
		}else{
			[...document.querySelectorAll('.langCheckBox:checked')].forEach((checkbox) => {
				this.savedLangs.push(checkbox.id);
			});
		}

		this.DOMElement = sidebarDOM;
	}

	addLanguage(language){
		this.savedLangs.push(language);
	}

	removeLanguage(language){
		this.savedLangs.splice(this.savedLangs.indexOf(language), 1);
	}

	processCheckboxToggle(checkbox, data){
		if (data.translations[checkbox.id].active){
			data.translations[checkbox.id].active = false;
			this.removeLanguage(checkbox.id);	
		}else{
			data.translations[checkbox.id].active = true;
			this.addLanguage(checkbox.id);
		}
	}

	testAndSetMasterToggle(){
		let allOrNone = this.testAllOrNone();
		let langToggle = document.querySelector('#masterLangToggle');
		if(allOrNone == 0){
			langToggle.checked = false;
			langToggle.setAttribute('data-state', 'off');
			langToggle.classList.remove('checkbox__box--threeway');
		}else if(allOrNone == 1){
			langToggle.checked = true;
			langToggle.setAttribute('data-state', 'on');
			langToggle.classList.remove('checkbox__box--threeway');
		}else if(allOrNone == 2){
			langToggle.checked = false;
			langToggle.setAttribute('data-state', 'mixed');
			langToggle.classList.add('checkbox__box--threeway');
		}
	}

	testAllOrNone(){
		let starter = this.langCheckBoxes[0].checked;
		for(let i = 1; i < this.langCheckBoxes.length; i++){
			if (this.langCheckBoxes[i].checked != starter){
				return 2;
			}
		}
		//all on or off in some manner
		if (starter){
			return 1;
		}else{
			return 0;
		}
	}

	processMasterCheckboxToggle(checkbox, data, callback){
		this.langCheckBoxes.forEach((langcheckbox) => {
			let prevCheck = langcheckbox.checked;
			if(['off', 'mixed'].indexOf(checkbox.getAttribute('data-state')) >= 0){
				langcheckbox.checked = true;
			}else if (checkbox.getAttribute('data-state') == 'on'){
				langcheckbox.checked = false;
			}
			if (prevCheck != langcheckbox.checked){
				this.processCheckboxToggle(langcheckbox, data);
			}
		});
		callback();
	}
}