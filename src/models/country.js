import { Util } from "../util/utility.js"
import { dataService } from "../data/data.js"

export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
        this.miscData = dataService.countriesAPIAlpha3Lookup[data.alpha3]
        this.processData()
    }

    processData() {
        this.fixRecoveryData()
        this.clipCurrentDay()
        this.generateDayReferenceData()
        this.generateActiveCases()
        this.generateMeasuresReference()
        const dataToExtract = dataService.getAvailabeTableNames()
        for (const dataName of dataToExtract) {
            const data = new google.visualization.DataTable()
            data.addColumn('datetime', 'Date')
            data.addColumn('number', this.name)
            data.addRows(this.baseData[dataName])
            this[dataName] = this.joinMetaData(data)
            //const joinedTable = google.visualization.data.join(
            //    data,
            //    this.dayReference,
            //    'inner',
            //    [[0,0]],
            //    [1],
            //    [1]
            //)
            //this[dataName] = joinedTable
        }
    }

    clipCurrentDay() {
        const dataToExtract = dataService.getAvailabeTableNames()
        for (const dataName of dataToExtract) {
            const table = this.baseData[dataName]
            const lastDate = table[table.length - 1][0]
            if (Util.isToday(lastDate))
                this.baseData[dataName].splice(this.baseData[dataName].length - 1)
        }
    }

    fixRecoveryData() {
        const startDate = this.baseData.recoveries[0][0]
        for (const [date, val] of this.baseData.cases) {
            if (date.toDateString() === startDate.toDateString()) break
            this.baseData.recoveries.unshift([date, 0])
        }
    }

    getOutbreakStartIndex() {
        if (this.outbreakStartIndex) return this.outbreakStartIndex
        const index = this.baseData.cases.findIndex(kv => kv[1] > 100)
        this.outbreakStartIndex = index
    }

    generateMeasuresReference() {
        if (!this.baseData.measures) return
        let referenceTable = []
        for (const name of Object.keys(this.baseData.measures)) {
            const date = this.baseData.measures[name][0]
            date.setHours(0,0,0,0)
            referenceTable.push([date, `point { size: 10; shape-type: ${this.baseData.measures[name][1]}; fill-color: #a52714;}`])
        }
        this.measuresReference = new google.visualization.DataTable()
        this.measuresReference.addColumn('datetime', 'Date')
        this.measuresReference.addColumn({'type': 'string', 'role': 'style'})
        this.measuresReference.addRows(referenceTable)
    }

    generateDayReferenceData() {
        this.getOutbreakStartIndex()
        let outbreakStartTable = []
        for (let index = 0; index < this.baseData.casesPct.length; index++) {
            outbreakStartTable.push((index <= this.outbreakStartIndex) ? 0 : index - this.outbreakStartIndex)
        }
        const processedData = this.baseData.cases.map((data, i) => [data[0], outbreakStartTable[i]])
        this.daysSinceOutbreak = outbreakStartTable[outbreakStartTable.length - 1]
        this.dayReference = new google.visualization.DataTable()
        this.dayReference.addColumn('datetime', 'Date')
        this.dayReference.addColumn('number', 'Day')
        this.dayReference.addRows(processedData)
    }

    generateActiveCases() {
        const activeCases = this.baseData.cases.map(([date, val], index) => {
            const recoveries = (this.baseData.recoveries[index]) ? this.baseData.recoveries[index][1] : 0
            return [date, val - recoveries - this.baseData.deaths[index][1]]
        })
        activeCases.splice(this.baseData.cases.length - 1)
        const activeCasesTable = Util.gerateDataTable([['datetime', 'Date'], ['number', this.name]], activeCases)
        this.activeCases = this.joinMetaData(activeCasesTable)
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
    }

    joinMetaData(table) {
        let joinedTable = google.visualization.data.join(
            table,
            this.dayReference,
            'inner',
            [[0,0]],
            [1],
            [1]
        )
        //if (this.measuresReference) {          
        //    joinedTable = google.visualization.data.join(
        //        joinedTable,
        //        this.measuresReference,
        //        'left',
        //        [[0,0]],
        //        [1,2],
        //        [1]
        //    )
        //}
        return joinedTable
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
    getRecoveriesByDate() {
        return this.recoveries
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
    getTotalDeaths() {
        return this.baseData.deaths[this.baseData.deaths.length - 1][1]
    }
    getTotalDeathRate() {
        return this.baseData.deathRate[this.baseData.deathRate.length - 1][1]
    }
    getCurrentGrowthRate() {
        return this.baseData.casesPct[this.baseData.casesPct.length - 1][1]
    }
    getCurrentOutbreakDay() {
        return this.daysSinceOutbreak
    }
    getAssumedRecoveries() {
        return this.assumedRecoveries
    }
    getActiveCasesByDate() {
        return this.activeCases
    }
    getCaseDensity() {
        const pop100k =  (this.miscData.population) / 100000
        return this.getTotalCases() / pop100k
    }
    getDeathsDensity() {
        const pop100k =  (this.miscData.population) / 100000
        return this.getTotalDeaths() / pop100k
    }
    getRecentGrowth(start = 5, days = 5) {
        const casesPct = this.baseData['casesPct']
        const daysToAverage = casesPct.slice(casesPct.length - start, casesPct.length - start + days).map(data => data[1])
        return daysToAverage.reduce((a, b) => a + b, 0) / days
    }
    getRecentGrowthChange(dayCount = 7) {
        const firstGrowth = this.getRecentGrowth(dayCount, dayCount)
        const secondGrowth = this.getRecentGrowth(2*dayCount, dayCount)   
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