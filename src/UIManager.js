import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { Util } from './utility.js'

export class UIManager {
  constructor(baseID) {
    this.interface = document.querySelector(baseID)
    this.chart = new D3Chart(baseID)
    this.renderCountryList()
    this.addDefaultCountries()
  }

  addDefaultCountries() {
    this.selectCountry('Denmark')
    this.selectCountry('Norway')
  }

  renderCountryList() {
    let countries = dataService.getDataSet().cases
    let countriesOptions = {}
    for (let country of Object.keys(countries)) countriesOptions[country] = null
    let autocomplete = M.Autocomplete.init(
      this.interface.querySelector('.autocomplete'),
      {
        data: countriesOptions,
        onAutocomplete: this.selectCountry.bind(this)
      }
    )
    let selected = this.interface.querySelector('.selectedCountries')
  }

  selectCountry(selection) {
    console.log(dataService.getDataSet())
    let countryData = dataService.getDataSet().cases[selection]
    console.log(countryData)
    this.chart.addGraph(new D3Graph(selection, Util.convertData(countryData), Util.colors[this.chart.graphs.length]))
    this.chart.draw()
  }
}
