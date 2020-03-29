import { dataService } from './data.js'
import { Observable } from '../util/observable.js'
export class CustomLabelDataProcessor extends Observable {
	constructor(dataKey, label) {
		super()
		this.label = label
		this.dataKey = dataKey
	}

	processingFunction(country) {
		return dataService.getCountryData(country)[this.dataKey]
	}

	getData(country) {
		return this.processingFunction(country)
	}

	getLabel(country) {
		return `${this.label}: ${country}`
	}
}