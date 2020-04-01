export class GoogleChart {
    constructor(elementID, countries) {
        this.element = document.querySelector(elementID)
        this.countries = countries
        this.processData()
        this.draw()
    }

    processData() {
        let joinedTable;
        const indicesList = []
        for (let index = 1; index < this.countries.length; index++) {
            const firstTable = (index == 1) ? this.countries[0].getTotalsByDate() : joinedTable
            const secondTable = this.countries[index].getTotalsByDate()
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
        const series = {}
        this.countries.forEach((country, index) => series[index] = {color: country.getColor()})
        this.options = {
            legend: {position: 'right'},
            series: series
        }
        console.log(this.options)        
    }

    draw() {
        this.chart = new google.visualization.LineChart(this.element)
        this.chart.draw(this.tableToRender, this.options)
    }
}