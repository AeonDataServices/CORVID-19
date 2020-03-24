import { Util } from './utility.js'

const fixedMargin = {
  top: 40, bottom: 40,
  left: 40, right: 40
}

export class D3Chart {
  constructor(svgID, tooltipID) {
    window.addEventListener("resize", this.resize.bind(this))
    this.svgID = svgID
    this.tooltipID = tooltipID
    this.graphs = []
    this.dataCount = 0
    this.xScale = null
    this.yScale = null
    this.tooltipLine = null
    this.canvas = document.querySelector(svgID)
    this.getElementSize()
    this.draw()
  }

  getElementSize() {
    let style = this.canvas.currentStyle || window.getComputedStyle(this.canvas)
    this.margin = fixedMargin
    this.width = this.canvas.parentElement.offsetWidth - this.margin.left - this.margin.right
    this.height = this.canvas.parentElement.offsetHeight - this.margin.top - this.margin.bottom
  }

  resize() {
    this.getElementSize()
    this.draw()
  }

  addGraph(graph, redraw = false) {
    this.graphs.push(graph)
    if (redraw) this.draw()
  }

  determineScale() {
    let allData = this.graphs.map(graph => graph.data).flat()
    this.yScale = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(allData, d => d[1])])

    this.xScale = d3.scaleTime()
      .range([0, this.width])
      .domain( d3.extent(allData, d => {return new Date(d[0])} ))

  }

  draw() {
    if (this.graphs.length === 0) return
    this.determineScale()
    document.querySelector(this.svgID).innerHTML = ''
    this.svg = d3.select(this.svgID)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
    this.tooltipLine = this.svg.append('line')
    console.log('ttl', this.tooltipLine)

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(this.xScale))
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
      let line = d3.line()
        .x((d,i) => i * this.width / graph.data.length +1)
        .y(d => this.yScale(d[1]))
        .curve(d3.curveMonotoneX)
      this.svg.append("path")
        .datum(graph.data)
        .attr("fill", "none")
        .attr("stroke", graph.color)
        .attr("stroke-width", 1.5)
        .attr("d", line)
    }
  }

  drawTooltip() {
    let mouseX = d3.mouse(document.querySelector(this.svgID + ' rect'))[0]
    this.tooltipLine.attr('stroke', 'black')
      .attr('x1', mouseX)
      .attr('x2', mouseX)
      .attr('y1', 0)
      .attr('y2', this.height)
    let tooltip = document.querySelector(this.tooltipID)
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
