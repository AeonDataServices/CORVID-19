import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { Util } from './utility.js'

export class UIManager {
  constructor(baseID, statistic) {
    this.interface = document.querySelector(baseID)
    this.chart = new D3Chart(baseID)
    this.statistic = statistic
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
  }

  selectCountry(selection) {
    this.interface.querySelector('.autocomplete').value = ''
    let countryData = dataService.getDataSet().cases[selection]
    let color = Util.colors[this.chart.graphs.length]
    this.chart.addGraph(new D3Graph(selection, Util.convertData(countryData), color))
    this.chart.draw()
    let div = document.createElement('div')
    let selected = this.interface.querySelector('.selectedCountries')
    selected.appendChild(div)
    div.className = "countryOption"
    div.innerHTML = `<span class="label"><i class="fas fa-square" style="color:${color}"></i> ${selection }</span> <span class="delete"><i class="fas fa-minus-square" data-value="${selection}"></i></span>`
    div.querySelector('.delete').onclick = (event => {
      this.removeCountry(event.target.getAttribute('data-value'), event.target)
    })
  }

  removeCountry(country, target) {
    if (this.chart.graphs.length === 1) {
      alert("you can't remove all graphs");
      return
    }
    this.chart.removeGraph(country, true)
    let element = target.closest('.countryOption')
    element.parentNode.removeChild(element)
  }
}
