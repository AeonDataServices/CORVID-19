import { Observable } from '../util/observable.js'

export class DataSelectionProvider extends Observable {
	constructor(dataSets = ['cases']) {
		super()
		this.dataSets = dataSets
	}

	getSelectedData() {
	  return [...this.dataSets]
	}
}