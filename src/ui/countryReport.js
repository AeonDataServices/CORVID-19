import { Util } from "../util/utility.js"
import { dataService } from "../data/data.js"
import { ContainmentMeasures } from "../data/containmentMeasures.js"
import { Observable } from "../util/observable.js"

export class CountryReport extends Observable {
	constructor(elementID) {
		super()
		this.element = document.querySelector(elementID)
		this.country = dataService.getCountry('Sweden')
		this.initSelector()
		this.findCountryMeasures()
		this.printReport()
	}
	
	initSelector() {
		const selector = this.element.querySelector('#countriesSelector')
		const countries = dataService.getFocusedCountries()
		for (const country of countries) {
			const element = Util.appendElement(selector, 'option', country, '')
			element.setAttribute('value', country)
		}
		M.FormSelect.init(this.element.querySelector('#countriesSelector'), {});
		selector.addEventListener('change',this.countrySelectionChangeEvent.bind(this))
	}

	countrySelectionChangeEvent(event) {
		const countryName = event.target[event.target.selectedIndex].value
		this.country = dataService.getCountry(countryName)
		this.findCountryMeasures()
		this.printReport()
		this.notifyObservers([this.country])
	}
	
	getSelectedCountries() {
		return [this.country]
	}

	findCountryMeasures() {
		this.countryMeasures = new ContainmentMeasures(this.country.getName())
	}

	printReport() {
		this.setText('#countryName', this.country.getName())
		this.element.querySelector('#flag').setAttribute('src', `https://www.countryflags.io/${this.country.miscData.alpha2Code}/flat/48.png`)
		this.setText('#totalCases', Util.commaSeparatedNumber(this.country.getTotalCases()))
		this.setText('#caseDensity', Math.round(this.country.getCaseDensity()))
		this.setText('#increase5', this.country.getRecentGrowth())
		this.setText('#increase', this.country.getCurrentGrowthRate())
		this.setText('#deaths', this.country.getTotalDeaths())
		this.setText('#deathRate', this.country.getTotalDeathRate())
		this.element.querySelector('#measuresList').innerHTML = ''
		for (const measure of this.countryMeasures.countryMeasures) {
			this.printMeasure(measure)
		}
		this.printMeasures()
	}

	printMeasures() {
		const measureIDs = [
			'SelfQuarantineAdvise',
			'SocialDistancing',
			'RemoteWork',
			'SchoolClosure',
			'PublicGatheringsLImit',
			'EmergencyState',
			'limBusinessClosure',
			'fullBusinessClosure',
			'localLockdown',
			'nationalLockdown',
			'domesticTravelBan',
			'riskTravelBan',
			'blanketTravelBan',
		]
		for (const measure of measureIDs) {
			const implemented = this.countryMeasures[measure].active
			console.log(measure, implemented, this.booleanIcon(implemented), this.countryMeasures.countryName)
			this.element.querySelector(`#${measure}`).classList = this.booleanIcon(implemented)
		}
	}

	booleanIcon(value) {
		return (value) ? 'far fa-check-square' : 'fas fa-question'
	}

	setText(query, text) {
		this.element.querySelector(query).innerHTML = text
	}

	printMeasure(measure) {
		const measureContainer = Util.appendElement(this.element.querySelector('#measuresList'), 'div', '', 'col s12')
		Util.appendElement(measureContainer, 'h5', measure['Date Start'], '')
		Util.appendElement(measureContainer, 'p', measure['Description of measure implemented'], '')
		const source = Util.appendElement(measureContainer, 'a', 'Source', '')
		source.setAttribute('href', measure['Source'])
	}
}