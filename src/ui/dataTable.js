import { dataService } from '../data.js'
import { D3Chart } from '../d3rendering/d3chart.js'
import { D3Graph, colors } from '../d3rendering/d3graph.js'
import { Util } from '../util/utility.js'
import { DataSelectionProvider } from './dataSelectionProvider.js'

export class DataTable {
	constructor(baseID, countryProvider, domainProvider, highlightProviders) {
		this.interface = document.querySelector(baseID)
		countryProvider.subscribe(this.renderedCountriesChanged.bind(this))
		domainProvider.subscribe(this.changeDomain.bind(this))
		this.renderedCountries = countryProvider.getSelectedCountries()
		this.domainIndices = domainProvider.getSelectedDomainIndices()
		this.renderedData = ['cases']
		for (const provider of highlightProviders) provider.subscribe(this.updateHighlighting.bind(this))
		this.drawTable()
	}

	changeDomain(newDomainIndices) {
		this.domainIndices = newDomainIndices
		this.drawTable()
	}

	renderedCountriesChanged(newRenderedCountries) {
		this.renderedCountries = newRenderedCountries
		this.drawTable()
	}

	drawTable() {
		let thead = this.interface.querySelector('thead tr')
		thead.innerHTML = ''
		Util.appendElement(thead, 'th', 'Date')
		for (const country of this.renderedCountries) {
		for (let data of this.renderedData) Util.appendElement(thead, 'th', `${data}(${country})`)
		}
		let tbody = this.interface.querySelector('.data-table tbody')
		tbody.innerHTML = ''
		let dateRange = dataService.getDateRange()
		for (let i = dateRange.length; i > -1 ; i--) {
			let date = dateRange[i]
			if (i < this.domainIndices[0] || i > this.domainIndices[1]) {continue}
			let row = Util.appendElement(tbody, 'tr', '')
			Util.appendElement(row, 'td', `${Util.dateShortStringFromIndex(i)}`)
			for (let country of this.renderedCountries) {
				for (let data of this.renderedData) {
				Util.appendElement(row, 'td', dataService.getCountryData(country)[data][i][1])
				}
			}
		}
	}

	updateHighlighting([date, data]) {
		console.log(date, data)		
		if (data.join() !== this.renderedData.join()) {
			this.renderedData = data
			this.drawTable()
		}
		const dateIndex = dataService.getDateIndex(date)
		const dateIndexAdjusted = dateIndex - this.domainIndices[0]
		const tbody = this.interface.querySelector('tbody')
		for (const tableChild of tbody.childNodes) tableChild.classList.remove('highlight')
		const tableIndex = tbody.childNodes.length - dateIndexAdjusted
		const highlightNode = tbody.childNodes[tableIndex - 1]
		highlightNode.classList.add('highlight')
		highlightNode.scrollIntoView(false)
	}
}