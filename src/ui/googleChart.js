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
        } else {
            let joinedTable;
            this.tableToRender = null
            const indicesList = []
            for (let index = 1; index < this.countries.length; index++) {
                const firstTable = (index == 1) ? this.countries[0][this.dataFunction]() : joinedTable
                const secondTable = this.countries[index][this.dataFunction]()
                indicesList.push(index)
                joinedTable = google.visualization.data.join(
                    firstTable,
                    secondTable,
                    'inner',
                    [[0,0]],
                    indicesList,
                    [1]
                )  
            }
            this.tableToRender = joinedTable
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
        console.log(countries)
    }

    draw() {
        this.chart.draw(this.tableToRender, this.options)
    }
}