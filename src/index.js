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
    const mainChart = new UIManager('#chart-total', countrySelector, new DataSelectionProvider(), domainProvider)
    const chart2 = new UIManager('#chart-casesPct', countrySelector, new DataSelectionProvider(['casesPct']), domainProvider)
    const chart3 = new UIManager('#chart-newcases', countrySelector, new DataSelectionProvider(['newCases']), domainProvider)
    const chart4 = new UIManager('#chart-deaths', countrySelector, new DataSelectionProvider(['deaths']), domainProvider)
    new DataTable('.data-table', countrySelector, domainProvider, [mainChart, chart2, chart3, chart4])
  })
})
