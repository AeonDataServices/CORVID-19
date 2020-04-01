import { dataService } from './data/data.js'
import { D3Chart } from './d3rendering/d3chart.js'
import { D3Graph, colors } from './d3rendering/d3graph.js'
import { CountrySelector } from './ui/countrySelector.js'
import { DomainProvider } from './ui/domainProvider.js'
import { UIManager } from './ui/UIManager.js'
import { DataSelectionProvider } from './ui/dataSelectionProvider.js'
import { DataTable } from './ui/dataTable.js'
import { SimpleDataProcessor } from './data/simpleDataProcessor.js'
import { CustomLabelDataProcessor } from './data/customLabelDataProcessor.js'
import { CasesFromDeathsProcessor } from './data/casesFromDeathsProcessor.js'
import { InputProvider } from './ui/inputProvider.js'
import { DelayedDetectionCasesProcessor } from './data/delayedDetectionProcessor.js'
import { WorldMap } from './d3rendering/worldmap.js'
document.addEventListener('DOMContentLoaded', () => {
  dataService.isDataInitialized().then(() => {
    const countrySelector = new CountrySelector('#mainDisplay .countries-list')
    const domainProvider = new DomainProvider('.dateRange-slider')
    const mainChart = new UIManager('#chart-total', countrySelector, new DataSelectionProvider(), domainProvider)
    const chart2 = new UIManager('#chart-casesPct', countrySelector, new DataSelectionProvider([new CustomLabelDataProcessor('casesPct', 'Growth %')]), domainProvider)
    const chart3 = new UIManager('#chart-newcases', countrySelector, new DataSelectionProvider([new CustomLabelDataProcessor('newCases', 'New cases')]), domainProvider)
    const chart4 = new UIManager('#chart-deaths', countrySelector, new DataSelectionProvider([new SimpleDataProcessor('deaths')]), domainProvider)
    const chart5 = new UIManager('#chart-deathrate', countrySelector, new DataSelectionProvider([new CustomLabelDataProcessor('deathRate', 'Death rate(%)')]), domainProvider)

    const firstCustomDataProviders = [
      new CasesFromDeathsProcessor(new InputProvider('#cases-from-rate-input')),
      new CustomLabelDataProcessor('cases', 'Confirmed cases'),
      new CustomLabelDataProcessor('deaths', 'Confirmed deaths')
    ]
    const custom1 = new UIManager('#custom-chart-1', countrySelector,new DataSelectionProvider(firstCustomDataProviders), domainProvider)
    new DataTable('.data-table', countrySelector, domainProvider, [mainChart, chart2, chart3, chart4, chart5, custom1])
    const secondCustomDataProviders = [
      new DelayedDetectionCasesProcessor(new InputProvider('#cases-lag-time-input')),
      new CustomLabelDataProcessor('casesPct', 'Confirmed growth rate(%)')
    ]
    const custom2 = new UIManager('#custom-chart-2', countrySelector,new DataSelectionProvider(secondCustomDataProviders), domainProvider)
    new DataTable('.data-table', countrySelector, domainProvider, [mainChart, chart2, chart3, chart4, chart5, custom2])

    M.Tabs.init(document.querySelector('.tabs'), {})
  })
})
