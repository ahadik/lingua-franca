import Input from './Input.js';
import Data from  './Data.js';
import Sidebar from './Sidebar.js';

var textInput;
var translationData;
var sidebar;

window.onload = ()=>{
	sidebar = new Sidebar(document.querySelector('#mainSidebar'));
	translationData = new Data();
	textInput = new Input(document.querySelector('#translationTextField'), document.querySelector('#translationTextSubmit'), (data)=>{translationData.setData(data); translationData.setRows(); translationData.renderData();});
	
	let hamburgers = document.querySelectorAll('.icon__hamburger');
	[...hamburgers].forEach((hamburger) => {
		hamburger.addEventListener('click', ()=> {
			hamburger.classList.toggle('icon__hamburger--open');
		}, true);
	});
	
	document.querySelector('#sidePanelHamburger').addEventListener('click', (event) => {
		document.querySelector('#fullContentWrapper').classList.toggle('content-wrapper__all--mini');
	});

	let checkBoxes = document.querySelectorAll('.langCheckBox');
	[...checkBoxes].forEach((checkBox) => {
		checkBox.addEventListener('change', (e) => {
			sidebar.processCheckboxToggle(e.target, translationData);
			if (translationData.set){
				translationData.setRows();
				translationData.renderData();
			}
		});
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