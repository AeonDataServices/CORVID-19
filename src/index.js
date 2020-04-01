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
import { GoogleChart } from './ui/googleChart.js'
document.addEventListener('DOMContentLoaded', () => {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(() => {
    dataService.isDataInitialized().then(() => {
      const countrySelector = new CountrySelector('#mainDisplay .countries-list')
      const domainProvider = new DomainProvider('.dateRange-slider')
      const mainChart = new UIManager('#chart-total', countrySelector, new DataSelectionProvider(), domainProvider)

      // const chart = new google.visualization.LineChart(document.getElementById('chart-casesPct'))
      // let table1 = dataService.getCountries()[0].getTotalsByDate()
      // let table2 = dataService.getCountries()[1].getTotalsByDate()
      // let newTable = google.visualization.data.join(
      //   table1,
      //   table2,
      //   'inner',
      //   [[0,0]],
      //   [1],
      //   [1]
      // )
      // console.log(newTable)
      // chart.draw(newTable)
      new GoogleChart('#chart-casesPct', dataService.getCountries())

      M.Tabs.init(document.querySelector('.tabs'), {})
    })
  })
})
