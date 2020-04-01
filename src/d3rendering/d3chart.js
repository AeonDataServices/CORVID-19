import { Util } from '../util/utility.js'
import { dataService } from '../data/data.js'

const fixedMargin = {
  top: 40, bottom: 40,
  left: 40, right: 40
}

export class D3Chart {
  constructor(interfaceID, hoverCallback) {
    window.addEventListener("resize", this.resize.bind(this))
    this.interfaceID = interfaceID
    this.hoverCallback = hoverCallback
    this.graphs = []
    this.dataCount = 0
    this.xScale = null
    this.yScale = null
    this.domain = []
    this.tooltipLine = null
    this.canvas = document.querySelector(interfaceID).querySelector('.chart')
    this.getElementSize()
    this.draw()
  }

  getElementSize() {
    let style = this.canvas.currentStyle || window.getComputedStyle(this.canvas)
    this.margin = fixedMargin
    this.width = this.canvas.parentElement.offsetWidth - this.margin.left - this.margin.right
    this.height = this.canvas.parentElement.offsetHeight - this.margin.top - this.margin.bottom
  }

  clear() {
    this.graphs = []
  }

  graphExists(label) {
    return (this.graphs.filter(graph => graph.label === label).length > 0)
  }

  resize() {
    this.getElementSize()
    this.draw()
  }

  addGraph(graph, redraw = false) {
    this.graphs.push(graph)
    this.determineScale()
    if (redraw) this.draw()
  }

  removeGraph(country, redraw = false) {
    this.graphs = this.graphs.filter(graph => graph.label !== country)
    if (redraw) {
      this.determineScale()
      this.draw()
    }
  }

  changeDomain(minIndex, maxIndex) {
    const dateRange = dataService.getDateRange()
    this.domain =  [dateRange[minIndex], dateRange[maxIndex]]
    this.determineScale()
    this.draw()
  }

  determineScale() {
    let allData = this.graphs.map(graph => graph.data).flat()
    this.yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(allData, d => d[1])])

    this.xScale = d3.scaleTime()
      .range([0, this.width])
      .domain(this.domain)
      //.domain(d3.extent(this.graphs[0].data, d => d[0]))

    this.line = d3.line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[1]))
      .curve(d3.curveMonotoneX)
  }

  draw() {
    if (this.graphs.length === 0) return
    this.canvas.innerHTML = ''
    this.svg = d3.select(`${this.interfaceID} .chart`)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    this.tooltipLine = this.svg.append('line')
    this.xScale
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("id", "x-axis")
      .call(
        d3.axisBottom(this.xScale)
          .tickValues(this.xScale.ticks(10))
          .tickFormat(d3.timeFormat("%m/%d"))
      )
    this.svg.append("g")
      .attr("id", "y-axis")
      .call(d3.axisLeft(this.yScale))
    this.svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('opacity', 0)
      .on('mousemove', this.drawTooltip.bind(this))
      .on('mouseout', this.removeTooltip.bind(this))

    for (let graph of this.graphs) {
      graph.draw(this)
    }
  }

  drawTooltip() {
    let mouseX = d3.mouse(this.canvas.querySelector('rect'))[0]
    let dateTime = this.xScale.invert(mouseX)
    mouseX = this.xScale(Util.roundDate(dateTime))
    this.tooltipLine.attr('stroke', 'black')
      .attr('x1', mouseX)
      .attr('x2', mouseX)
      .attr('y1', 0)
      .attr('y2', this.height)
    this.hoverCallback(Util.roundDate(dateTime))
    return
    let tooltip = document.querySelector(this.interfaceID).querySelector('.chartTooltip')
    let text = ''
    for (let graph of this.graphs) {
      let index = Math.round(graph.data.length * (mouseX / this.width))
      text = text + `<i class="fas fa-square" style="color:${graph.color}"></i> ( ${graph.data[index][0]}) ${graph.label}: ${graph.data[index][1]} <br/>`
    }
    tooltip.innerHTML = text
  }

  removeTooltip() {
    this.tooltipLine.attr('stroke', 'none')
  }
}
