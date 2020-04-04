import { dataService } from '../data/data.js'
import { DashCard } from './dashCard.js'
import { Util } from '../util/utility.js'

export class Dashboard {
	constructor() {
		this.initMap()
		this.initCards()
	}

	initMap() {
		this.map = new google.visualization.GeoChart(document.getElementById('mainMap'))
		this.map.draw(dataService.getAllCountriesTable('Rate of new cases(%) past 5 days', 'getRecentGrowth'), {
		  colorAxis: {colors: ['white', 'red']},
		  datalessRegionColor: '#adadad',
		  legend: 'none'
		})
	}

	initCards() {
		const countriesCard = new DashCard('#leftCards', `${dataService.getFocusedCountries().length}`, 'Countries tracked')
		Util.appendElement(countriesCard.content, 'p', dataService.getFocusedCountries().join('<br/>'), 'list')
		new DashCard('#rightCards', `${Math.round(dataService.getGlobalNewCases())}%`, 'Case increase in the past 5 days')
		new DashCard('#rightCards', `${Math.round(dataService.getGlobalDeathRate())}%`, 'Average Death Rate')
	}
}