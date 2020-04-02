import { dataService } from './data/data.js'
import { CountrySelector } from './ui/countrySelector.js'
import { DomainProvider } from './ui/domainProvider.js'
import { SimpleDataProcessor } from './data/simpleDataProcessor.js'
import { CustomLabelDataProcessor } from './data/customLabelDataProcessor.js'
import { CasesFromDeathsProcessor } from './data/casesFromDeathsProcessor.js'
import { InputProvider } from './ui/inputProvider.js'
import { DelayedDetectionCasesProcessor } from './data/delayedDetectionProcessor.js'
import { GoogleChart } from './ui/googleChart.js'
document.addEventListener('DOMContentLoaded', () => {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(() => {
    dataService.isDataInitialized().then(() => {
      const countrySelector = new CountrySelector('#mainDisplay .countries-list')
      //const domainProvider = new DomainProvider('.dateRange-slider')
      new GoogleChart('#chart-total-cases', countrySelector, 'Total confirmed cases','getTotalCasesByDate')
      new GoogleChart('#chart-new-cases', countrySelector, 'New cases','getNewCasesByDate')
      new GoogleChart('#chart-growth-rate', countrySelector, 'Growth rate','getGrowthRateByDate', {
        vAxis:
        {
            logScale: true,
            viewWindow: {
              min: 0,
              max: 50
            }
        }
      })
      new GoogleChart('#chart-death-rate', countrySelector, 'Death rate','getDeathRateByDate')
      M.Tabs.init(document.querySelector('.tabs'), {})
    })
  })
})
