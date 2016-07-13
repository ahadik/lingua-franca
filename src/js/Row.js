export default class Row{
	constructor(domElement, width, language, languageID){
		this.domElement = domElement;
		this.width = width;
		this.language = language;
		this.languageID = languageID;
	}

	static compareWidth(a, b, ascending) {
		let compVal = a.width - b.width;
		if (compVal == 0){
			compVal = a.language > b.language ? 1 : -1;
		}
		return ascending ? compVal : compVal*(-1);
	}

	static compareLanguage(a, b, ascending) {
		if (a > b) {
			return ascending ? 1 : -1;
		}else if (b > a) {
			return ascending ? -1 : 1;
		}else{
			return 0;
		}
	}
}