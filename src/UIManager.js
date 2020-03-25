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
    this.domainIndices = []
    this.dataToShow = ['cases']
    this.renderCountryList()
    this.addDefaultCountries()
    this.initDateRange()
    this.chartChanged()
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
    for (let country of Object.keys(countries)) countriesOptions[country] = null
    let autocomplete = M.Autocomplete.init(
      this.interface.querySelector('.autocomplete'),
      {
        data: countriesOptions,
        onAutocomplete: this.selectCountry.bind(this)
      }
    )
  }

  initDateRange() {
    let dateRange = dataService.getDateRange()
    let slider = noUiSlider.create(this.interface.querySelector('.dateRange-slider'), {
      start: [0, dateRange.length - 1],
      connect: true,
      step: 1,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      range: {
        'min': 0,
        'max': (dateRange.length - 1)
      },
      format: {to: dateIndex => Util.dateShortStringFromIndex(Math.round(dateIndex)), from: Number}
    })
    this.domainIndices = [0, dateRange.length - 1]
    slider.on('update', this.changeDateRange.bind(this))
  }

  changeDateRange(value, handle, originalValues) {
    this.domainIndices = originalValues.map(val=>Math.round(val))
    this.chart.changeDomain(...this.domainIndices)
    this.chartChanged()
  }

  selectCountry(country) {
    this.interface.querySelector('.autocomplete').value = ''
    this.renderedCountries[country] = this.dataToShow
    this.drawCountry(country)
    this.chartChanged()
  }

  drawCountry(country) {
    for (let data of this.dataToShow) {
      let label = `${country} (${data})`
      if (this.chart.graphExists(label)) continue
      let countryData = dataService.getCountryData(country)[data]
      let color = Util.colors[this.chart.graphs.length]
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
    this.chart.removeGraph(`${country} (${data})`, true)
    let element = target.closest('.countryOption')
    element.parentNode.removeChild(element)
    //this.renderedCountries = this.renderedCountries.filter(item => country !== item)
    this.renderedCountries[country] = this.renderedCountries[country].filter(item => data !== item)
    if (this.renderedCountries[country].length === 0) delete this.renderedCountries[country]
    this.chartChanged()
  }

  changeData() {
    this.chart.clear()
    this.interface.querySelector('.selectedCountries').innerHTML = ''
    this.dataToShow = this.dataSelector.getSelectedValues()
    for (let country of Object.keys(this.renderedCountries)) {
      this.renderedCountries[country] = this.dataToShow
      this.drawCountry(country)
    }
    this.chartChanged()
  }

  chartChanged() {
    this.interface.querySelector('.chartTitle').innerHTML = `Showing ${this.dataToShow.join(', ')} for ${Object.keys(this.renderedCountries).join(', ')}`
    this.drawTable()
  }

  drawTable() {
    let thead = this.interface.querySelector('.data-table thead tr')
    thead.innerHTML = ''
    Util.appendElement(thead, 'th', 'Date')
    for (let country of Object.keys(this.renderedCountries)) {
      for (let data of this.dataToShow) Util.appendElement(thead, 'th', `${data}(${country})`)
    }
    let tbody = this.interface.querySelector('.data-table tbody')
    tbody.innerHTML = ''
    let dateRange = dataService.getDateRange()
    for (let i = dateRange.length - 1; i > 0 ; i--) {
      let date = dateRange[i]
      if (i < this.domainIndices[0] || i > this.domainIndices[1]) {continue}
      let row = Util.appendElement(tbody, 'tr', '')
      Util.appendElement(row, 'td', `${Util.dateShortStringFromIndex(i)}`)
      for (let country of Object.keys(this.renderedCountries)) {
        for (let data of this.dataToShow) {
          Util.appendElement(row, 'td', dataService.getCountryData(country)[data][i][1])
        }
      }
    }
  }
}
