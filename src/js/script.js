import Input from './Input.js';
import Data from  './Data.js';
import Sidebar from './Sidebar.js';
import Cookie from './Cookie.js';

var textInput;
var translationData;
var sidebar;

window.onload = ()=>{
	sidebar = new Sidebar(document.querySelector('#mainSidebar'));
	translationData = new Data();
	
	let requestCallback = (data)=>{
		translationData.setData(data); 
		translationData.setRows(); 
		translationData.renderData();
	}

	textInput = new Input(document.querySelector('#translationTextField'), document.querySelector('#translationTextSubmit'), requestCallback);
	
	let hamburgers = document.querySelectorAll('.icon__hamburger');
	[...hamburgers].forEach((hamburger) => {
		hamburger.addEventListener('click', ()=> {
			hamburger.classList.toggle('icon__hamburger--open');
		}, true);
	});

	//Handle re-translation for selection of new language after initial translation
	let langDropdown = document.querySelector('#inputLanguageSelector');
	langDropdown.addEventListener('change', () => {
		if (!document.querySelector('#inputLanguage').classList.contains('card__dropdown--onload')){
			textInput.triggerRequest(requestCallback, langDropdown.value);
		}
	});
	
	document.querySelector('#sidePanelHamburger').addEventListener('click', (event) => {
		document.querySelector('#header').classList.toggle('header--open');

		let callback = function(){
			document.querySelector('.header--open').classList.remove('header--open');
			document.querySelector('.icon__hamburger').classList.remove('icon__hamburger--open');
			openWrapper.removeEventListener('click', callback, false);
			document.querySelector('#header').scrollTop = 0;

		}
		if (document.querySelector('.header').classList.contains('header--open')){
			var openWrapper = document.querySelector('.header--open + .content-wrapper');
			openWrapper.addEventListener('click', callback, false);
		}
		
	});

	let checkBoxes = document.querySelectorAll('.langCheckBox');
	
	function displayGraph(data){
		if (data.set){
			data.setRows();
			data.renderData();
		}
	}

	[...checkBoxes].forEach((checkBox) => {
		checkBox.addEventListener('change', (e) => {
			sidebar.processCheckboxToggle(e.target, translationData);
			Cookie.createCookie('languages',JSON.stringify(sidebar.savedLangs));
			sidebar.testAndSetMasterToggle();
			displayGraph(translationData);
		});
	});

	let masterLangToggle = document.querySelector('#masterLangToggle');
	sidebar.testAndSetMasterToggle();
	masterLangToggle.addEventListener('change', (event)=>{
		sidebar.processMasterCheckboxToggle(masterLangToggle, translationData, () => {
			Cookie.createCookie('languages', JSON.stringify(sidebar.savedLangs));
			displayGraph(translationData);
		});
		sidebar.testAndSetMasterToggle();
	});

	let columnArrowHeaders = document.querySelectorAll('.table__column--sortable');
	[...columnArrowHeaders].forEach((columnArrowHeader) => {
		columnArrowHeader.addEventListener('click', (event) => {
			event.target.classList.toggle('table__column--up');
			event.target.classList.toggle('table__column--down');
			
		});
	});

	document.querySelector('#dataTranslationHeader').addEventListener('click', (event) => {
		let direction = parseInt(event.target.getAttribute('data-direction'));
		event.target.setAttribute('data-direction', direction ? 0 : 1);
		translationData.sortRows('width', direction ? false : true);
		translationData.renderData();
	});

};