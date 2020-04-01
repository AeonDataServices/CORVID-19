import { dataService } from './data.js'
import { Observable } from '../util/observable.js'
export class DelayedDetectionCasesProcessor extends Observable {
	constructor(lagTimeProvider) {
		super()
		lagTimeProvider.subscribe(this.newData.bind(this))
		this.lagTime = lagTimeProvider.getInputValue()
	}

	newData(newLagTime) {
		this.lagTime = newLagTime
		this.notifyObservers(newLagTime)
	}

	processingFunction(country) {
		const data = [...dataService.getCountryData(country)['casesPct']]
		let i = 0
		for (const dataPoint of data) {
			if (i + parseInt(this.lagTime) >= data.length) {
				data[i] = [dataPoint[0], null]
			} else {
				const newData = [
					dataPoint[0],
					data[Math.min(i + parseInt(this.lagTime), data.length - 1)][1]
				]
				data[i] = newData
			}
			i++
		}
		return data
	}

	getData(country) {
		return this.processingFunction(country)
	}

	getLabel(country) {
		return `Growth rate(%) assumed from ${this.lagTime} days before detection: ${country}`
	}
}