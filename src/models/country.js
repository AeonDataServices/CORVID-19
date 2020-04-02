export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
        this.processData()
    }

    processData() {
        this.getOutbreakStartIndex()
        const dataToExtract = Object.keys(this.baseData)
        let outbreakStartTable = []
        for (let index = 0; index < this.baseData.casesPct.length; index++) {
            outbreakStartTable.push((index < this.outbreakStartIndex) ? 0 : index - this.outbreakStartIndex)
        }
        const processedData = this.baseData.cases.map((data, i) => [data[0], outbreakStartTable[i]])
        this.dayReference = new google.visualization.DataTable()
        this.dayReference.addColumn('datetime', 'Date')
        this.dayReference.addColumn('number', 'Day')
        this.dayReference.addRows(processedData)
        for (const dataName of dataToExtract) {
            const data = new google.visualization.DataTable()
            data.addColumn('datetime', 'Date')
            data.addColumn('number', this.name)
            data.addRows(this.baseData[dataName])
            this[dataName] = data
        }
    }

    getOutbreakStartIndex() {
        const index = this.baseData.casesPct.findIndex(kv => kv[1] > 10)
        this.outbreakStartIndex = index
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
    getTotalCases() {
        return this.baseData.cases[this.baseData.cases.length - 1][1]
    }

    getName() {
        return this.name
    }

    getColor() {
        return this.color
    }

    setColor(color) {
        this.color = color
    }
}