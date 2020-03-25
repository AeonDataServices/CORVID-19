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
    this.interface.querySelector('svg rect.eventCatcher').addEventListener('mousedown', this.mousedown.bind(this))
    this.interface.querySelector('svg rect.eventCatcher').addEventListener('mousemove', this.mousemove.bind(this))
    this.interface.querySelector('svg rect.eventCatcher').addEventListener('mouseup', this.mouseup.bind(this))
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

  initDateRange() {
    let dateRange = dataService.getDateRange()
    console.log(dateRange)
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

  mousedown(e) {
    this.mouseDownPosition = this.dateIndexMouseX(e.offsetX, e.target.width.baseVal.value + 40)
  }

  mousemove(e) {
    let mouseMovePosition = this.dateIndexMouseX(e.offsetX, e.target.width.baseVal.value + 40)
    if (this.mouseDownPosition > -1) this.chart.renderBox(true, this.mouseDownPosition, mouseMovePosition)
  }

  mouseup(e) {
    let mouseUpPosition = this.dateIndexMouseX(e.offsetX, e.target.width.baseVal.value + 40)
    let diff = Math.abs (this.mouseDownPosition - mouseUpPosition)
    if (diff > 2) {
      this.chart.changeDomain(this.mouseDownPosition, mouseUpPosition)
      this.chartChanged()
    }
    this.mouseDownPosition = -1
    this.chart.renderBox(false)
  }

  dateIndexMouseX(mouseX, width) {
    let range = this.domainIndices[1] - this.domainIndices[0]
    let adjustedRange = range / width
    let start = this.domainIndices[0]
    return Math.round(start + mouseX * adjustedRange)
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
      if (this.chart.graphExists(label)) {
        console.log('exists', label)
        continue
      }
      let countryData = dataService.getDataSet()[data][country]
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
    console.log('args', arguments)
    this.chart.removeGraph(`${country} (${data})`, true)
    let element = target.closest('.countryOption')
    element.parentNode.removeChild(element)
    //this.renderedCountries = this.renderedCountries.filter(item => country !== item)
    this.renderedCountries[country] = this.renderedCountries[country].filter(item => data !== item)
    if (this.renderedCountries[country].length === 0) delete this.renderedCountries[country]
    console.log(this.renderedCountries)
    this.chartChanged()
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
    this.chartChanged()
  }

  chartChanged() {
    this.interface.querySelector('.chartTitle').innerHTML = `Showing ${this.dataToShow.join(', ')} for ${Object.keys(this.renderedCountries).join(', ')}`
    this.drawTable()
  }

  drawTable() {
    console.log('drawing');
    let thead = this.interface.querySelector('.data-table thead tr')
    thead.innerHTML = ''
    Util.appendElement(thead, 'th', 'Date')
    for (let country of Object.keys(this.renderedCountries)) {
      for (let data of this.dataToShow) Util.appendElement(thead, 'th', `${data}(${country})`)
    }
    let tbody = this.interface.querySelector('.data-table tbody')
    tbody.innerHTML = ''
    let dateRange = dataService.getDateRange()
    let countries = dataService.getDataSet()
    console.log(this.domainIndices)
    for (let i = dateRange.length - 1; i > 0 ; i--) {
      let date = dateRange[i]
      if (i < this.domainIndices[0] || i > this.domainIndices[1]) {continue}
      let row = Util.appendElement(tbody, 'tr', '')
      Util.appendElement(row, 'td', `${Util.dateShortStringFromIndex(i)}`)
      for (let country of Object.keys(this.renderedCountries)) {
        for (let data of this.dataToShow) {
          Util.appendElement(row, 'td', countries[data][country][i][1])
        }
      }
    }
  }
}
