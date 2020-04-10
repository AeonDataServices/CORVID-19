import { Util } from "../util/utility.js"
import { dataService } from "../data/data.js"

export class BubbleChart {
    constructor(elementID, chartTitle, additionalOptions = {}) {
        this.chartTitle = chartTitle
        this.additionalOptions = additionalOptions

        const container = document.querySelector(elementID)
        this.element = Util.appendElement(container, 'div', '', 'chartWrapper col s12')
        this.chartElement = Util.appendElement(this.element, 'div', '', 'chart', 'bubbleChart')

        this.countries = dataService.getCountries()

        this.processData()
        this.chart = new google.visualization.BubbleChart(this.chartElement)
        this.draw()
    }

    processData() {
		const data = [['Country', 'Days since >100 cases', 'Growth rate in last 5 days', 'Death Rate', 'Total Cases']]
		for (const country of this.countries) {
		  data.push([
				country.miscData.alpha3Code,
				country.getCurrentOutbreakDay(),
				country.getRecentGrowth(),
				country.getTotalDeathRate(),
				country.getTotalCases(),
			])
		}
		this.tableToRender = google.visualization.arrayToDataTable(data)
    }

    countriesChanged(countries) {
        this.renderedCountries = countries
        this.updateChart()
    }

    updateChart() {
        this.processData()
        this.draw()
    }

    draw() {
        this.chart.draw(this.tableToRender, {
            colorAxis: {colors: ['white', '#ff3333'], legend: {position: 'bottom'}},
            title: 'Case growth percent for the past 5 days compared to days since since exceeding a 100 cases',
            bubble: {
                textStyle: {
                  auraColor: 'none'
                }
              },
			hAxis: {format: '# Days', ticks:[{v:0,f:''},20,40,60,80,100]},
            vAxis: {format: "#'%'"},
            chartArea: {'width': '85%'}
		})
    }
}