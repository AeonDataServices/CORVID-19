import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { Util } from './utility.js'

export class UIManager {
  constructor(baseID, statistic) {
    this.interface = document.querySelector(baseID)
    this.chart = new D3Chart(baseID)
    this.statistic = statistic
    this.renderedCountries = {}
    this.dataToShow = ['cases']
    this.renderCountryList()
    this.addDefaultCountries()
    this.dataSelector = M.FormSelect.init(this.interface.querySelector('select'), {});
    this.interface.querySelector('select').onchange = () => this.changeData()
  }

  addDefaultCountries() {
    this.selectCountry('Denmark')
    this.selectCountry('Norway')
  }

  renderCountryList() {
    let countries = dataService.getDataSet()
    let countriesOptions = {}
    console.log(countries)
    for (let country of Object.keys(countries)) countriesOptions[country] = null
    let autocomplete = M.Autocomplete.init(
      this.interface.querySelector('.autocomplete'),
      {
        data: countriesOptions,
        onAutocomplete: this.selectCountry.bind(this)
      }
    )
  }

  selectCountry(country) {
    this.interface.querySelector('.autocomplete').value = ''
    this.renderedCountries[country] = this.dataToShow
    this.drawCountry(country)
  }

  drawCountry(country) {
    for (let data of this.dataToShow) {
      let label = `${country} (${data})`
      if (this.chart.graphExists(label)) {
        console.log('exists', label)
        continue
      }
      let countryData = dataService.getDataSet()[country][data]
      let color = Util.colors[this.chart.graphs.length]
      console.log(countryData)
      this.chart.addGraph(new D3Graph(label, countryData, color))
      this.chart.draw()
      let div = document.createElement('div')
      let selected = this.interface.querySelector('.selectedCountries')
      selected.appendChild(div)
      div.className = "countryOption"
      div.innerHTML = `<span class="label"><i class="fas fa-square" style="color:${color}"></i>${label}</span> <span class="delete"><i class="fas fa-minus-square" data-value="${country},${data}"></i></span>`
      div.querySelector('.delete').onclick = (event => {
        this.removeCountry(...(event.target.getAttribute('data-value')).split(','), event.target)
      })
    }
  }

  removeCountry(country, data, target) {
    console.log('args', arguments)
    this.chart.removeGraph(`${country} (${data})`, true)
    let element = target.closest('.countryOption')
    element.parentNode.removeChild(element)
    //this.renderedCountries = this.renderedCountries.filter(item => country !== item)
    this.renderedCountries[country] = this.renderedCountries[country].filter(item => data !== item)
    if (this.renderedCountries[country].length === 0) delete this.renderedCountries[country]
    console.log(this.renderedCountries)
  }

  changeData() {
    this.chart.clear()
    this.interface.querySelector('.selectedCountries').innerHTML = ''
    this.dataToShow = this.dataSelector.getSelectedValues()
    console.log(this.renderedCountries, this.dataToShow)
    for (let country of Object.keys(this.renderedCountries)) {
      this.renderedCountries[country] = this.dataToShow
      this.drawCountry(country)
    }
  }
}
