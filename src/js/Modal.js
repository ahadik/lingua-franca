export default class Modal{
	constructor(modal){
		this.events = {};
		this.container = modal;
		this.container.addEventListener('click', (event) => {
			this.close();
		});

		this.container.querySelector('.modal__window').addEventListener('click', (event) => {
			event.cancelBubble = true;
		});

		[...this.container.querySelectorAll('.modal__close')].forEach(
			(button) => {button.addEventListener('click', (event) => {
				this.close();
			});
		});
	}

	on(event, func){
		if (event in this.events){
			this.events[event].push(func);
		}else{
			this.events[event] = [func];
		}
	}

	close(){
		this.container.classList.remove('modal--show');
		this.container.classList.add('modal--hidden');
	}

	open(){
		this.events.open.forEach((func) => {
			(func)(this.container);
		});
		this.container.classList.add('modal--show');
		this.container.classList.remove('modal--hidden');
	}
}