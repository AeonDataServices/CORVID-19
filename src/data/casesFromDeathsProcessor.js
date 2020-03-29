import { dataService } from './data.js'
import { Observable } from '../util/observable.js'
export class CasesFromDeathsProcessor extends Observable {
	constructor(rateProvider) {
		super()
		this.label = 'Cases dervided from deaths'
		rateProvider.subscribe(this.newData.bind(this))
		this.deathRate = rateProvider.getInputValue()
	}

	newData(newRate) {
		this.deathRate = newRate
		this.notifyObservers(newRate)
	}

	processingFunction(country) {
		const data = dataService.getCountryData(country)['deaths']
		const processedData = data.map(d => [d[0], Math.round(d[1] / this.deathRate * 100)])
		return processedData
	}

	getData(country) {
		return this.processingFunction(country)
	}

	getLabel(country) {
		return `Cases derived from ${this.deathRate}% death rate: ${country}`
	}
}