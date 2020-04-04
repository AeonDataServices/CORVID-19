import { dataService } from './data/data.js'
import { CountrySelector } from './ui/countrySelector.js'
import { GoogleChart } from './ui/googleChart.js'
import { loadingScreen } from './ui/loadingScreen.js'
import { Dashboard } from './ui/dashBoard.js'

loadingScreen.startLoading()

loadingScreen.updateText('Loading DOM')
document.addEventListener('DOMContentLoaded', () => {
  loadingScreen.updateText('DOM loaded')
  loadingScreen.updateText('Initializing Data')
  dataService.isDataInitialized().then(() => {
    loadingScreen.finishLoading()
    new Dashboard()
    const countrySelector = new CountrySelector('.countries-list')
		new GoogleChart('#chart-total-cases', countrySelector, 'Total confirmed cases','getTotalCasesByDate')
		new GoogleChart('#chart-new-cases', countrySelector, 'New cases','getNewCasesByDate')
		new GoogleChart('#chart-growth-rate', countrySelector, 'Growth rate','getGrowthRateByDate', {
		  vAxis:
		  {
			  logScale: true
		  }
		})
		new GoogleChart('#chart-death-rate', countrySelector, 'Death rate','getDeathRateByDate')

    M.Tabs.init(document.querySelector('.tabs'), {})
  })
})
