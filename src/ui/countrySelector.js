import { dataService } from '../data/data.js'
import { Util } from '../util/utility.js'
import { Observable } from '../util/observable.js'

export class CountrySelector extends Observable {
  constructor(elementID, defaultCountries = [dataService.getCountries()[9], dataService.getCountries()[10]]) {
    super()
    this.listDiv = document.querySelector(elementID)
    this.selectedCountries = defaultCountries
    this.renderCountryList()
  }

  renderCountryList() {
    const countries = dataService.getCountries()
    for (const country of countries) {
      const section = Util.appendElement(this.listDiv, 'p', '')
      const label = Util.appendElement(section, 'label', '')
      const input = Util.appendElement(label, 'input', '')
      input.addEventListener('change', this.changeSelectionEvent.bind(this))
      input.setAttribute('type', 'checkbox')
      if (this.isCountrySelected(country.getName())) input.setAttribute('checked', 'checked')
      input.setAttribute('class', 'filled-in')
      input.setAttribute('data-country', country.getName())
      Util.appendElement(label, 'span', `${country.getName()}`)
      //const picker = Util.appendElement(section, 'span', `<i style="color: ${country.getColor()}" class="fas fa-square"></i>`)
      //picker.addEventListener('click', Util.colorPicker.bind(null, [this]))
      const picker = Util.appendElement(section, 'input', ``)
      picker.setAttribute('type', 'color')
      picker.setAttribute('value', country.getColor())
      picker.addEventListener('change', this.changeColorEvent.bind(this, country))
    }
  }

  changeSelectionEvent(event) {
    const country = event.target.getAttribute('data-country')
    this.changeSelection(country)
  }

  changeColorEvent(countryName, event) {
    const color = event.target.value
    countryName.color = color
    this.notifyObservers(this.selectedCountries)
  }

  changeSelection(countryName) {
    const countryIndex = this.selectedCountries.findIndex(country => country.getName() === countryName)
    if (countryIndex > -1) {
      this.selectedCountries.splice(countryIndex, 1);
    } else {
      this.selectedCountries.push(dataService.getCountry(countryName))
    }
    this.notifyObservers(this.selectedCountries)
  }

  getSelectedCountries() {
    return this.selectedCountries
  }

  isCountrySelected(countryName) {
    return (this.selectedCountries.findIndex(country => country.getName() === countryName) > -1)
  }
}
