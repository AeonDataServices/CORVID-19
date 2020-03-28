import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { CountrySelector } from './countrySelector.js'
import { UIManager } from './UIManager.js'
document.addEventListener('DOMContentLoaded', () => {
  dataService.isDataInitialized().then(() => {
    const countrySelector = new CountrySelector('#mainDisplay .countries-list')
    new UIManager('#mainDisplay', countrySelector)
  })
})
