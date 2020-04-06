import { dataService } from '../data/data.js'
import { Util } from '../util/utility.js'

export class MainTable {
	constructor(elementID) {
		this.element = document.querySelector(elementID)
		this.initTable()
		this.renderTable()
	}

	initTable() {
		this.thead = Util.appendElement(this.element, 'thead', '', '')
		this.tbody = Util.appendElement(this.element, 'tbody', '', '')
		const tr = Util.appendElement(this.thead, 'tr', '', '')
		const dataToShow = [
			'Country',
			'Total cases',
			'Case density',
			'New cases(5d)',
			'New cases(24h)',
			'Overall death rate'
		]
		for (const header of dataToShow)
			Util.appendElement(tr, 'th', header, '')
	}

	renderTable() {
		for (const country of dataService.getCountries())
			this.renderCountryRow(country)
	}

	renderCountryRow(country) {
		const row = Util.appendElement(this.element, 'tr', '', '')
		Util.appendElement(row, 'td', country.getName(), '')
		Util.appendElement(row, 'td', Util.commaSeparatedNumber(country.getTotalCases()), '')
		Util.appendElement(row, 'td', `${Math.round(country.getCaseDensity())}/100k`, '')
		Util.appendElement(row, 'td', `${country.getRecentGrowth()}%`, '')
		const casesToday = country.getCurrentGrowthRate()
		const casesYesterday = country.getRecentGrowth(2,1)
		let changeIcon = ''
		let changeText = ''
		if (casesToday > casesYesterday) {
			changeIcon = '<i class="fas fa-arrow-down"></i>'
			changeText = 'Decreased'
		}
		if (casesToday < casesYesterday) {
			changeIcon = '<i class="fas fa-arrow-up"></i>'
			changeText = 'Increased'
		}
		const change = Util.appendElement(row, 'td', 
				`${casesToday}% ${changeIcon}`,
			'')
		M.Tooltip.init(change, {html: `${changeText} from ${casesYesterday}% two days ago`});
		Util.appendElement(row, 'td', `${country.getTotalDeathRate()}%`, '')
	}
}