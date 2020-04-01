import { dataService } from '../data/data.js'
import { D3Chart } from '../d3rendering/d3chart.js'
import { D3Graph, colors } from '../d3rendering/d3graph.js'
import { Util } from '../util/utility.js'
import { DataSelectionProvider } from './dataSelectionProvider.js'
import { Observable } from '../util/observable.js'

export class UIManager extends Observable {
  constructor(baseID, countryProvider, dataSelectionProvider, domainProvider) {
    super()
    this.interface = document.querySelector(baseID)
    this.chart = new D3Chart(baseID, this.hoverCallback.bind(this))
    countryProvider.subscribe(this.renderedCountriesChanged.bind(this))
    dataSelectionProvider.subscribe(this.changeData.bind(this))
    domainProvider.subscribe(this.changeDomain.bind(this))
    this.renderedCountries = countryProvider.getSelectedCountries()
    this.dataToShow = dataSelectionProvider.getSelectedData()
    this.domainIndices = domainProvider.getSelectedDomainIndices()
    this.chart.changeDomain(...this.domainIndices)
    this.chartChanged()
  }

  changeDomain(newDomainIndices) {
    this.domainIndices = newDomainIndices
    this.chart.changeDomain(...this.domainIndices)
    this.chartChanged()
  }

  renderedCountriesChanged(newRenderedCountries) {
    const countriesRemoved = this.renderedCountries.filter(country => !newRenderedCountries.includes(country))
    for (const country of countriesRemoved)
      for (const data of this.dataToShow) this.chart.removeGraph(data.getLabel(country), true)
    this.renderedCountries = newRenderedCountries
    this.chartChanged()
  }

  renderCountriesLegend() {
    const countriesLegend = this.interface.querySelector('.chartElement')
    countriesLegend.innerHTML = ''
    for (const graph of this.chart.graphs) {
      const icon = (graph.style.length > 1) ? 'far' : 'fas'
      Util.appendElement(countriesLegend, 'h6', `<i style="color: ${graph.color}" class="${icon} fa-square"></i> ${graph.label}`)
    }
  }

  drawCountry(country) {
    let dataIndex = 0
    for (let dataProcessor of this.dataToShow) {
      let label = dataProcessor.getLabel(country)
      if (this.chart.graphExists(label)) continue
      let countryData = dataProcessor.getData(country)
      let color = Util.colors[this.chart.graphs.length]
      let stroke = (dataIndex > 0) ? ["stroke-dasharray", ("3, 3")] : ['']
      this.chart.addGraph(new D3Graph(label, countryData, color, stroke))
      this.chart.draw()
      let div = document.createElement('div')
      div.className = "countryOption"
      div.innerHTML = `<span class="label"><i class="fas fa-square" style="color:${color}"></i>${label}</span> <span class="delete"><i class="fas fa-minus-square" data-value="${country},${dataProcessor.label}"></i></span>`
      div.querySelector('.delete').onclick = (event => {
        this.removeCountry(...(event.target.getAttribute('data-value')).split(','), event.target)
      })
      dataIndex++
    }
  }

  changeData() {
    this.chart.clear()
    this.chartChanged()
  }

  chartChanged() {
    this.interface.querySelector('.chartTitle').innerHTML = `${this.dataToShow.map(proc => proc.label).join(', ')}`
    for (const country of this.renderedCountries) this.drawCountry(country)
    this.renderCountriesLegend()
  }

  hoverCallback(date) {
    const dateIndex = dataService.getDateIndex(date)
    this.notifyObservers([date, this.dataToShow])
  }
}
