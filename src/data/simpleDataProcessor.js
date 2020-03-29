import { dataService } from './data.js'
import { Observable } from '../util/observable.js'
export class SimpleDataProcessor extends Observable {
	constructor(label, processingFunction) {
		super()
		if(processingFunction) this.processingFunction = processingFunction
		this.label = label
	}

	processingFunction(country) {
		return dataService.getCountryData(country)[this.label]
	}

	getData(country) {
		return this.processingFunction(country)
	}

	getLabel(country) {
		return `${this.label}: ${country}`
	}
}