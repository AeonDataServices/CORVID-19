import { dataService } from './data/data.js'
import { CountrySelector } from './ui/countrySelector.js'
import { GoogleChart } from './ui/googleChart.js'
import { loadingScreen } from './ui/loadingScreen.js'
import { Dashboard } from './ui/dashBoard.js'
import { PageManager } from './ui/pagination.js'
import { BubbleChart } from './ui/bubbleChart.js'
import { MainTable } from './ui/mainTable.js'
import { CountryReport } from './ui/countryReport.js'

loadingScreen.startLoading()

loadingScreen.updateText('Loading DOM')
document.addEventListener('DOMContentLoaded', () => {
  loadingScreen.updateText('DOM loaded')
  loadingScreen.updateText('Initializing Data')
  
  dataService.isDataInitialized().then(() => {
	loadingScreen.finishLoading()

		new Dashboard()
		const countrySelector = new CountrySelector('.countries-list')
		new GoogleChart('#baseCharts', countrySelector, 'Total confirmed cases','getTotalCasesByDate')
		new GoogleChart('#baseCharts', countrySelector, 'New cases','getNewCasesByDate')
		new GoogleChart('#baseCharts', countrySelector, 'Growth rate','getGrowthRateByDate', {
		  vAxis:  {
				logScale: true,
				format: "#'%'"
		  }
		})
		new GoogleChart('#baseCharts', countrySelector, 'Death rate','getDeathRateByDate', {
			vAxis: {
				format: "#'%'"
			}
		})
		new GoogleChart('#JHUCharts', countrySelector, 'Recoveries','getRecoveriesByDate')
		new GoogleChart('#JHUCharts', countrySelector, 'Active cases','getActiveCasesByDate')
		new BubbleChart('#miscCharts', countrySelector, 'Bubble chart of Growth rate, Time since outbreak, Death rate and Total cases')
		new MainTable('#mainTable')
		const countryReport = new CountryReport('#country')
		new GoogleChart('#country #detail-charts', countryReport, 'New cases','getNewCasesByDate', {}, true, false, false, false)
		new GoogleChart('#country #detail-charts', countryReport, 'Growth rate','getGrowthRateByDate', {}, true, false, false, false)
		new PageManager('body')
  })
  const sidenav = document.querySelectorAll('.sidenav');
  const sidenavInstance = M.Sidenav.init(sidenav, {closeOnClick: true, edge: 'right'}); 

})
