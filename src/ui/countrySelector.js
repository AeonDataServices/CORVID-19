import { dataService } from '../data/data.js'
import { Util } from '../util/utility.js'
import { Observable } from '../util/observable.js'

export class CountrySelector extends Observable {
  constructor(elementID, defaultCountries = ['Denmark', 'Norway']) {
    super()
    this.listDiv = document.querySelector(elementID)
    this.selectedCountries = defaultCountries
    this.renderCountryList()
  }

  renderCountryList() {
    const countries = dataService.getFocusedCountries()
    for (const country of countries) {
      const section = Util.appendElement(this.listDiv, 'p', '')
      const label = Util.appendElement(section, 'label', '')
      const input = Util.appendElement(label, 'input', '')
      input.addEventListener('change', this.changeSelectionEvent.bind(this))
      input.setAttribute('type', 'checkbox')
      if (this.isCountrySelected(country)) input.setAttribute('checked', 'checked')
      input.setAttribute('class', 'filled-in')
      input.setAttribute('data-country', country)
      Util.appendElement(label, 'span', country)
    }
  }

  changeSelectionEvent(event) {
    const country = event.target.getAttribute('data-country')
    this.changeSelection(country)
  }

  changeSelection(country) {
    const countryIndex = this.selectedCountries.indexOf(country)
    if (countryIndex > -1) {
      this.selectedCountries.splice(countryIndex, 1);
    } else {
      this.selectedCountries.push(country)
    }
    this.notifyObservers([...this.selectedCountries])
  }

  getSelectedCountries() {
    return [...this.selectedCountries]
  }

  isCountrySelected(country) {
    return (this.selectedCountries.indexOf(country) > -1)
  }
}
