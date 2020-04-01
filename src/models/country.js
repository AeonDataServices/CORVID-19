export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
        this.processData()
    }

    processData() {
        const totals = new google.visualization.DataTable()
        totals.addColumn('datetime', 'Date')
        totals.addColumn('number', this.name)
        totals.addRows(this.baseData.cases)
        this.totals = totals
    }

    getTotalsByDate() {
        return this.totals
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