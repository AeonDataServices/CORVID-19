const startFromOutbreak = true
export class GoogleChart {
    constructor(elementID, countryProvider, chartTitle, dataFunction, additionalOptions = {}) {
        this.chartTitle = chartTitle
        this.dataFunction = dataFunction
        this.additionalOptions = additionalOptions

        this.element = document.querySelector(elementID)

        countryProvider.subscribe(this.countriesChanged.bind(this))
        this.countries = countryProvider.getSelectedCountries()

        this.processData()
        this.chart = new google.visualization.LineChart(this.element)
        this.draw()
    }

    processData() {
        if (this.countries.length === 1) {
            this.tableToRender = this.countries[0][this.dataFunction]()
            this.tableToRender = new google.visualization.DataView(this.tableToRender)
            this.tableToRender.setColumns((startFromOutbreak) ? [2, 1] : [0, 1])
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
                    (startFromOutbreak) ? outBreakKey : [[0,0]],
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
            legend: {position: 'right'},
            series: series
        }
        for (const key of Object.keys(this.additionalOptions)) this.options[key] = this.additionalOptions[key]
    }

    countriesChanged(countries) {
        this.renderedCountries = countries
        this.processData()
        this.draw()
    }

    draw() {
        if (startFromOutbreak) {
            const rows = this.tableToRender.getFilteredRows([{column: 0, minValue: 1}])
            this.tableToRender.setRows(rows)
        }
        this.chart.draw(this.tableToRender, this.options)
    }
}