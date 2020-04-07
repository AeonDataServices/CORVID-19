import { Util } from "../util/utility.js"

export class GoogleChart {
    constructor(
            elementID,
            countryProvider,
            chartTitle,
            dataFunction,
            additionalOptions = {},
            defaultStart = false,
            defaultLegend = false,
            defaultLog = false,
            defalutWidth = false
    ) {
        this.chartTitle = chartTitle
        this.dataFunction = dataFunction
        this.additionalOptions = additionalOptions
        this.startFromOutbreak = defaultStart
        this.legend = defaultLegend
        this.logarithmic = defaultLog
        this.fullWidth = defalutWidth

        const container = document.querySelector(elementID)
        this.element = Util.appendElement(container, 'div', '', 'chartWrapper col l6 s12')
        this.chartElement = Util.appendElement(this.element, 'div', '', 'chart')
        this.inputWrapper = Util.appendElement(this.element, 'div', '', 'inputs')
        this.initModifiers()

        countryProvider.subscribe(this.countriesChanged.bind(this))
        this.countries = countryProvider.getSelectedCountries()

        this.processData()
        this.chart = new google.visualization.LineChart(this.chartElement)
        this.draw()
    }

    initModifiers() {
        this.cog = Util.appendElement(this.inputWrapper, 'a', '<i class="fas fa-cog"></i>')
        this.cog.addEventListener('click', (() => {
            const hidden = this.switches.style.display === 'none'
            if (hidden) {
                this.switches.style.display = 'block'
                this.cog.querySelector('i').className = 'fas fa-minus-square'
            } else {
                this.switches.style.display = 'none'
                this.cog.querySelector('i').className = 'fas fa-cog'
            }
        }).bind(this))
        this.switches = Util.appendElement(this.inputWrapper, 'div', '', 'switches')
        this.switches.style.display = 'none'
        const domainSwitch = Util.appendElement(this.switches, 'div', '', 'switch')
        Util.appendElement(domainSwitch, 'label', '<input type="checkbox"> <span class="lever"></span> Show as days since >100 cases', 'domainSwitch')
        this.element.querySelector('.domainSwitch input[type="checkbox"]').addEventListener('change', (() => {this.startFromOutbreak = !this.startFromOutbreak; this.updateChart()}).bind(this))
        
        const legendSwitch = Util.appendElement(this.switches, 'div', '', 'switch')
        Util.appendElement(legendSwitch, 'label', '<input type="checkbox"> <span class="lever"></span> Show legend', 'legendSwitch')
        this.element.querySelector('.legendSwitch input[type="checkbox"]').addEventListener('change', (() => {this.legend = !this.legend; this.updateChart()}).bind(this))
        
        const sizeSwitch = Util.appendElement(this.switches, 'div', '', 'switch')
        Util.appendElement(sizeSwitch, 'label', '<input type="checkbox"> <span class="lever"></span> Fullscreen', 'sizeSwitch')
        this.element.querySelector('.sizeSwitch input[type="checkbox"]').addEventListener('change', (() => {this.fullWidth = !this.fullWidth; this.updateChart()}).bind(this))
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
            }
            this.tableToRender = new google.visualization.DataView(joinedTable)
        }
        const series = {}
        this.countries.forEach((country, index) => series[index] = {color: country.getColor()})
        this.options = {
            title: this.chartTitle,
            legend: ((this.legend) ? {position: 'right'} : 'none'),
            series: series,
            chartArea: {left: 50, top: 40, width: ((this.legend) ? '80%': '90%'), height: '80%'},
            pointSize: 0.2,
        }
        for (const key of Object.keys(this.additionalOptions)) this.options[key] = this.additionalOptions[key]
    }

    countriesChanged(countries) {
        this.countries = countries
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
        if (this.fullWidth) {
            this.element.classList.remove('l6')
            this.element.classList.add('l12')
        } else {
            this.element.classList.remove('l12')
            this.element.classList.add('l6') 
        }
        this.chart.draw(this.tableToRender, this.options)
    }
}