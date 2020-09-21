import { dataService } from '../data/data.js'
import { Util } from '../util/utility.js'

export class MainTable {
	constructor(elementID) {
		this.element = document.querySelector(elementID)
		this.sortConfig = {col: 0, dir: 0}
		this.initTable()
		this.renderTable()
		this.orderColumn = 0
	}

	initTable() {
		this.thead = Util.appendElement(this.element, 'thead', '', '')
		this.tbody = Util.appendElement(this.element, 'tbody', '', '')
		const tr = Util.appendElement(this.thead, 'tr', '', '')
		const dataToShow = [
			'Country',
			'Total cases',
			'Case density',
			'Deaths density',
			'New cases(5d)',
			'New cases(24h)',
			'Overall death rate',
		]
		let index = 1;
		for (const header of dataToShow) {
			const element = Util.appendElement(tr, 'th', `${header} <i class="fas fa-arrows-alt-v"></i>`, '')
			element.setAttribute('column', index++)
			element.addEventListener('click', this.changeOrderEvent.bind(this))
		}
	}

	changeOrderEvent(event) {
		const target = event.target
		const currentDirection = parseInt(target.getAttribute('direction'))
		const column = target.getAttribute('column')
		Array.from(this.thead.querySelectorAll('th')).forEach(item => {
			if(item.getAttribute('column') !== column) item.setAttribute('direction', 0)
			item.querySelector('i').classList = 'fas fa-arrows-alt-v'
		})
		let newDirection = 1
		let newIcon = 'fas fa-caret-up'
		if (currentDirection && currentDirection !== 0) {
			newDirection = (currentDirection > 0) ? -1 : 0
			newIcon = (currentDirection > 0) ? 'fas fa-caret-down' : 'fas fa-arrows-alt-v'
		}
		target.setAttribute('direction', newDirection)
		console.log(target)
		target.querySelector('i').classList = newIcon
		this.sortConfig = {col: column, dir: newDirection}
		this.renderTable()
	}

	renderTable() {
		const table = this.getTableData()
		this.tbody.innerHTML = ''
		for (const row of table)
			this.renderCountryRow(row)
	}

	getTableData() {
		return dataService.getCountries().map(country => [
			country,
			country.getName(),
			country.getTotalCases(),
			country.getCaseDensity(),
			country.getDeathsDensity(),
			country.getRecentGrowth(),
			country.getCurrentGrowthRate(),
			country.getTotalDeathRate()
		]).sort((a, b) => {
			if (a[this.sortConfig.col] === b[this.sortConfig.col]) return 0
			return (a[this.sortConfig.col] < b[this.sortConfig.col]) ? -1*this.sortConfig.dir : 1*this.sortConfig.dir
		})
	}

	renderCountryRow([country, name, cases, density, deathsDensity, recentGrowth, growth, deathRate]) {
		const row = Util.appendElement(this.tbody, 'tr', '', '')
		Util.appendElement(row, 'td', name, '')
		Util.appendElement(row, 'td', Util.commaSeparatedNumber(cases), '')
		Util.appendElement(row, 'td', `${Math.round(density)}/100k`, '')
		Util.appendElement(row, 'td', `${Math.round(deathsDensity)}/100k`, '')
		Util.appendElement(row, 'td', `${recentGrowth}%`, '')
		const growthYesterday = country.getRecentGrowth(2,1)
		let changeIcon = ''
		let changeText = ''
		if (growth > growthYesterday) {
			changeIcon = '<i class="fas fa-arrow-up"></i>'
			changeText = 'Increased'
		}
		if (growth < growthYesterday) {
			changeIcon = '<i class="fas fa-arrow-down"></i>'
			changeText = 'Decreased'
		}
		const change = Util.appendElement(row, 'td', `${growth}% ${changeIcon}`,'')
		if (growth !== growthYesterday) M.Tooltip.init(change, {html: `${changeText} from ${growthYesterday}% two days ago`});
		Util.appendElement(row, 'td', `${deathRate}%`, '')
	}
}