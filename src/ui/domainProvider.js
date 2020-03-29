import { dataService } from '../data.js'
import { Observable } from '../util/observable.js'
import { Util } from '../util/utility.js'

export class DomainProvider extends Observable {
	constructor(elementID, domainIndices = [0, dataService.getDateRange().length]) {
		super()
		this.slider = document.querySelector(elementID)		
		this.domainIndices = domainIndices
		this.initDateRange()
	}

	initDateRange() {
	  let dateRange = dataService.getDateRange()
	  let slider = noUiSlider.create(this.slider, {
		start: [0, dateRange.length - 1],
		connect: true,
		step: 1,
		orientation: 'horizontal', // 'horizontal' or 'vertical'
		range: {
		  'min': 0,
		  'max': (dateRange.length - 1)
		},
		format: {to: dateIndex => Util.dateShortStringFromIndex(Math.round(dateIndex)), from: Number},
		pips: {
			mode: 'steps',
			density: 1,
			format: {to: dateIndex => Util.dateShortStringFromIndex(Math.round(dateIndex)), from: Number},
		}
	  })
	  this.domainIndices = [0, dateRange.length - 1]
	  slider.on('update', this.changeDateRange.bind(this))
	}

	changeDateRange(value, handle, originalValues) {
	  this.domainIndices = originalValues.map(val=>Math.round(val))
	  this.notifyObservers([...this.domainIndices])
	}

	getSelectedDomainIndices() {
	  return [...this.domainIndices]
	}
}