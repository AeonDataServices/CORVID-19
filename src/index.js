import { dataService } from './data/data.js'
import { CountrySelector } from './ui/countrySelector.js'
import { DomainProvider } from './ui/domainProvider.js'
import { SimpleDataProcessor } from './data/simpleDataProcessor.js'
import { CustomLabelDataProcessor } from './data/customLabelDataProcessor.js'
import { CasesFromDeathsProcessor } from './data/casesFromDeathsProcessor.js'
import { InputProvider } from './ui/inputProvider.js'
import { DelayedDetectionCasesProcessor } from './data/delayedDetectionProcessor.js'
import { GoogleChart } from './ui/googleChart.js'
import { loadingScreen } from './ui/loadingScreen.js'

loadingScreen.startLoading()

loadingScreen.updateText('Loading DOM')
document.addEventListener('DOMContentLoaded', () => {
  loadingScreen.updateText('DOM loaded')
  loadingScreen.updateText('Initializing Data')
  dataService.isDataInitialized().then(() => {
    loadingScreen.finishLoading()
    const countrySelector = new CountrySelector('#mainDisplay .countries-list')
    //const domainProvider = new DomainProvider('.dateRange-slider')
    new GoogleChart('#chart-total-cases', countrySelector, 'Total confirmed cases','getTotalCasesByDate')
    new GoogleChart('#chart-new-cases', countrySelector, 'New cases','getNewCasesByDate')
    new GoogleChart('#chart-growth-rate', countrySelector, 'Growth rate','getGrowthRateByDate', {
      vAxis:
      {
          logScale: true
      }
    })
    new GoogleChart('#chart-death-rate', countrySelector, 'Death rate','getDeathRateByDate')
    
    const mainMap = new google.visualization.GeoChart(document.getElementById('mainMap'))
    mainMap.draw(dataService.getAllCountriesTable('Rate of new cases(%) past 5 days', 'getRecentGrowth'), {
      colorAxis: {colors: ['white', 'red']},
      datalessRegionColor: '#adadad',
      legend: 'none'
    })

    M.Tabs.init(document.querySelector('.tabs'), {})
  })
})
