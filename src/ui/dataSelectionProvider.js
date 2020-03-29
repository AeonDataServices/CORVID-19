import { Observable } from '../util/observable.js'
import { SimpleDataProcessor } from '../data/simpleDataProcessor.js'

export class DataSelectionProvider extends Observable {
	constructor(dataProcessors = [new SimpleDataProcessor('cases')]) {
		super()
		this.dataProcessors = dataProcessors
		for (const processor of dataProcessors) processor.subscribe(this.notifyObservers.bind(this))
	}

	getSelectedData() {
	  return [...this.dataProcessors]
	}
}