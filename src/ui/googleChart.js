import { Util } from "../util/utility.js"

export class GoogleChart {
    constructor(elementID, countryProvider, chartTitle, dataFunction, additionalOptions = {}) {
        this.chartTitle = chartTitle
        this.dataFunction = dataFunction
        this.additionalOptions = additionalOptions
        this.startFromOutbreak = false
        this.logarithmic = false

        const container = document.querySelector(elementID)
        this.element = Util.appendElement(container, 'div', '', 'chartWrapper col l6 s12')
        this.chartElement = Util.appendElement(this.element, 'div', '', 'chart')
        this.initModifiers()

        countryProvider.subscribe(this.countriesChanged.bind(this))
        this.countries = countryProvider.getSelectedCountries()

        this.processData()
        this.chart = new google.visualization.LineChart(this.chartElement)
        this.draw()
    }

    initModifiers() {
        const logSwitch = Util.appendElement(this.element, 'div', '', 'switch')
        Util.appendElement(logSwitch, 'label', '<input type="checkbox"> <span class="lever"></span> Show as days since >100 cases')
        this.element.querySelector('input[type="checkbox"]').addEventListener('change', (() => {this.startFromOutbreak = !this.startFromOutbreak; this.updateChart()}).bind(this))
    }

    processData() {
        if (this.countries.length === 1) {
            this.tableToRender = this.countries[0][this.dataFunction]()
            this.tableToRender = new google.visualization.DataView(this.tableToRender)
            this.tableToRender.setColumns((this.startFromOutbreak) ? [2, 1] : [0, 1])
        } else {
            let joinedTable;
            this.tableToRender = null
            const indicesList = []
            for (let index = 1; index < this.countries.length; index++) {
                const firstTable = (index === 1) ? this.countries[0][this.dataFunction]() : joinedTable
                const secondTable = this.countries[index][this.dataFunction]()
                const outBreakKey = (index === 1) ? [[2,2]] : [[0,2]]
                indicesList.push(index)
                joinedTable = google.visualization.data.join(
                    firstTable,
                    secondTable,
                    'full',
                    (this.startFromOutbreak) ? outBreakKey : [[0,0]],
                    indicesList,
                    [1]
                )
                console.log('joining', firstTable, secondTable)
            }
            console.log('indices', indicesList, joinedTable)
            this.tableToRender = new google.visualization.DataView(joinedTable)
        }
        const series = {}
        this.countries.forEach((country, index) => series[index] = {color: country.getColor()})
        this.options = {
            title: this.chartTitle,
            //legend: {position: 'right'},
            legend: 'none',
            series: series,
            chartArea: {left: 50, top: 40, width: '90%', height: '80%'}
        }
        for (const key of Object.keys(this.additionalOptions)) this.options[key] = this.additionalOptions[key]
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
        if (this.startFromOutbreak) {
            const rows = this.tableToRender.getFilteredRows([{column: 0, minValue: 1}])
            this.tableToRender.setRows(rows)
        }
        this.chart.draw(this.tableToRender, this.options)
    }
}