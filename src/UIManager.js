import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { Util } from './util/utility.js'

export class UIManager {
  constructor(baseID, countryProvider) {
    this.interface = document.querySelector(baseID)
    this.chart = new D3Chart(baseID)
    this.domainIndices = []
    this.dataToShow = ['cases']
    countryProvider.subscribe(this.renderedCountriesChanged.bind(this))
    this.renderedCountries = countryProvider.getSelectedCountries()
    this.initDateRange()
    this.chartChanged()
    this.dataSelector = M.FormSelect.init(this.interface.querySelector('select'), {});
    this.interface.querySelector('select').onchange = () => this.changeData()
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

  renderedCountriesChanged(newRenderedCountries) {
    const countriesRemoved = this.renderedCountries.filter(country => !newRenderedCountries.includes(country))
    for (const country of countriesRemoved)
      for (const data of this.dataToShow) this.chart.removeGraph(`${country} (${data})`, true)
    this.renderedCountries = newRenderedCountries
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
      div.className = "countryOption"
      div.innerHTML = `<span class="label"><i class="fas fa-square" style="color:${color}"></i>${label}</span> <span class="delete"><i class="fas fa-minus-square" data-value="${country},${data}"></i></span>`
      div.querySelector('.delete').onclick = (event => {
        this.removeCountry(...(event.target.getAttribute('data-value')).split(','), event.target)
      })
    }
  }

  changeData() {
    this.chart.clear()
    this.dataToShow = this.dataSelector.getSelectedValues()
    this.chartChanged()
  }

  chartChanged() {
    this.interface.querySelector('.chartTitle').innerHTML = `Showing ${this.dataToShow.join(', ')} for ${this.renderedCountries.join(', ')}`
    for (const country of this.renderedCountries) this.drawCountry(country)
    this.drawTable()
  }

  drawTable() {
    let thead = this.interface.querySelector('.data-table thead tr')
    thead.innerHTML = ''
    Util.appendElement(thead, 'th', 'Date')
    for (const country of this.renderedCountries) {
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
      for (let country of this.renderedCountries) {
        for (let data of this.dataToShow) {
          Util.appendElement(row, 'td', dataService.getCountryData(country)[data][i][1])
        }
      }
    }
  }
}
