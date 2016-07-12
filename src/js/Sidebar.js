import Cookie from './Cookie.js';

export default class Sidebar{

	constructor(sidebarDOM){
		this.savedLangs = [];
		let langCookie = JSON.parse(Cookie.readCookie('languages'));
		let langCheckBoxes = document.querySelectorAll('.langCheckBox');

		if (langCookie){
			this.savedLangs = langCookie;
			[...langCheckBoxes].forEach((checkbox) => {
				checkbox.removeAttribute('checked');
			});

			this.savedLangs.forEach((lang) => {
				document.querySelector(`#${lang}`).setAttribute('checked', 'true');
			});
		}else{
			[...document.querySelectorAll('.langCheckBox')].forEach((checkbox) => {
				this.savedLangs.push(checkbox.id);
			});
		}

		this.DOMElement = sidebarDOM;
	}

	processCheckboxToggle(checkbox, data){
		if (data.translations[checkbox.id].active){
			data.translations[checkbox.id].active = false;
			this.savedLangs.splice(this.savedLangs.indexOf(checkbox.id), 1);
			
		}else{
			data.translations[checkbox.id].active = true;
			this.savedLangs.push(checkbox.id);
		}
		Cookie.createCookie('languages',JSON.stringify(this.savedLangs));
	}
}