export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
        this.processData()
    }

    processData() {
        const dataToExtract = Object.keys(this.baseData)
        for (const dataName of dataToExtract) {
            const data = new google.visualization.DataTable()
            data.addColumn('datetime', 'Date')
            data.addColumn('number', this.name)
            data.addRows(this.baseData[dataName])
            this[dataName] = data
        }
        console.log(this)
    }

    getTotalCasesByDate() {
        return this.cases
    }
    getGrowthRateByDate() {
        return this.casesPct
    }
    getDeathRateByDate() {
        return this.deathRate
    }
    getDeathsByDate() {
        return this.deaths
    }
    getNewCasesByDate() {
        return this.newCases
    }
    getNewDeathsByDate() {
        return this.newDeaths
    }

    getName() {
        return this.name
    }

    getColor() {
        return this.color
    }

    getDataTable() {

    }
}