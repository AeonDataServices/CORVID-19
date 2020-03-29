import { Observable } from '../util/observable.js'

export class InputProvider extends Observable {
	constructor(inputElementID) {
		super()
		this.inputElement = document.querySelector(inputElementID)
		this.inputElement.addEventListener('change', this.inputChanged.bind(this))
	}

	inputChanged() {
		this.notifyObservers(this.inputElement.value)
	}

	getInputValue() {
	  return this.inputElement.value
	}
}