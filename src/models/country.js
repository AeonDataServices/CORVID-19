import { Util } from "../util/utility.js"
import { dataService } from "../data/data.js"

export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
        this.miscData = dataService.countriesAPIAlpha3Lookup[data.alpha3]
        this.processData()
        console.log(this)
    }

    processData() {
        this.generateDayReferenceData()
        this.generateAssumedRecoveriesData()
        const dataToExtract = dataService.getAvailabeTableNames()
        for (const dataName of dataToExtract) {
            const data = new google.visualization.DataTable()
            data.addColumn('datetime', 'Date')
            data.addColumn('number', this.name)
            data.addRows(this.baseData[dataName])
            const joinedTable = google.visualization.data.join(
                data,
                this.dayReference,
                'inner',
                [[0,0]],
                [1],
                [1]
            )
            console.log('joined table', this.name, joinedTable)
            this[dataName] = joinedTable
        }
    }

    getOutbreakStartIndex() {
        if (this.outbreakStartIndex) return this.outbreakStartIndex
        const index = this.baseData.cases.findIndex(kv => kv[1] > 100)
        this.outbreakStartIndex = index
    }

    generateDayReferenceData() {
        this.getOutbreakStartIndex()
        let outbreakStartTable = []
        for (let index = 0; index < this.baseData.casesPct.length; index++) {
            outbreakStartTable.push((index <= this.outbreakStartIndex) ? 0 : index - this.outbreakStartIndex)
        }
        const processedData = this.baseData.cases.map((data, i) => [data[0], outbreakStartTable[i]])
        this.dayReference = new google.visualization.DataTable()
        this.dayReference.addColumn('datetime', 'Date')
        this.dayReference.addColumn('number', 'Day')
        this.dayReference.addRows(processedData)
    }

    generateAssumedRecoveriesData(recoveryTime = 14) {
        const newCases = this.baseData['newCases']
        const newDeaths = this.baseData['newDeaths']
        const assumedRecoveries = []
        for (let index = newCases.length - 1; index >= 0; index--) {
            const date = newCases[index][0]
            if (index < recoveryTime) {
                assumedRecoveries[index] = [date, 0]
                continue
            }
            const cases = newCases[index - recoveryTime][1]
            assumedRecoveries[index] = [date, cases]
        }
        this.assumedRecoveries = Util.gerateDataTable([['datetime', 'Date'], ['number', this.name]], assumedRecoveries)
        let totalRecoveries = 0
        const activeCases = this.baseData['cases'].map(([date, val], index) => {
            totalRecoveries = totalRecoveries + assumedRecoveries[index][1]
            return [date, val - totalRecoveries]
        })
        console.log(this.name, totalRecoveries)
        this.activeCases = Util.gerateDataTable([['datetime', 'Date'], ['number', this.name]], activeCases)
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
    getDayReference() {
        return this.dayReference
    }
    getTotalCases() {
        return this.baseData.cases[this.baseData.cases.length - 1][1]
    }
    getTotalDeathRate() {
        return this.baseData.deathRate[this.baseData.deathRate.length - 1][1]
    }
    getAssumedRecoveries() {
        return this.assumedRecoveries
    }
    getActiveCases() {
        return this.activeCases
    }
    getCaseDensity() {
        const pop100k =  (this.miscData.population) / 100000
        return this.getTotalCases() / pop100k
    }
    getRecentGrowth(start = 5, days = 5) {
        const casesPct = this.baseData['casesPct']
        const daysToAverage = casesPct.slice(casesPct.length - start, casesPct.length - start + days).map(data => data[1])
        return daysToAverage.reduce((a, b) => a + b, 0) / days
    }
    getRecentGrowthChange(dayCount = 7) {
        const firstGrowth = this.getRecentGrowth(dayCount, dayCount)
        const secondGrowth = this.getRecentGrowth(2*dayCount, dayCount)
        console.log(this.name, firstGrowth, secondGrowth)        
        return firstGrowth - secondGrowth
    }

    getName() {
        return this.name
    }
    getAlpha3Code() {
        return this.alpha3Code
    }

    getColor() {
        return this.color
    }

    setColor(color) {
        this.color = color
    }
}