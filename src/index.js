import { dataService } from './data.js'
import { D3Chart } from './d3rendering/d3chart.js'
import { D3Graph, colors } from './d3rendering/d3graph.js'
import { CountrySelector } from './ui/countrySelector.js'
import { DomainProvider } from './ui/domainProvider.js'
import { UIManager } from './ui/UIManager.js'
import { DataSelectionProvider } from './ui/dataSelectionProvider.js'
import { DataTable } from './ui/dataTable.js'
document.addEventListener('DOMContentLoaded', () => {
  dataService.isDataInitialized().then(() => {
    const countrySelector = new CountrySelector('#mainDisplay .countries-list')
    const domainProvider = new DomainProvider('.dateRange-slider')
    const mainChart = new UIManager('#mainDisplay', countrySelector, new DataSelectionProvider(), domainProvider)
    const secondChart = new UIManager('#secondaryChart', countrySelector, new DataSelectionProvider(['casesPct']), domainProvider)
    new DataTable('.data-table', countrySelector, domainProvider, [mainChart, secondChart])
  })
})
