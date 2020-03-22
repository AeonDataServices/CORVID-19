import { Util } from './utility.js'
export class D3Chart {
  constructor(svgID, data) {
    this.canvas = document.querySelector(svgID)
    this.getElementSize()
    console.log(data)
    this.svg = d3.select(svgID)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")

    const yScale = d3.scaleLinear()
                  .range([this.height, 0])
                  .domain([0, d3.max(data, d => d[1])]);

    const xScale = d3.scaleTime()
                    .range([0, this.width])
                    .domain( d3.extent(data, d => {return new Date(d[0])} ))
    this.svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d[1]))
      .attr("x", (d,i) => i * this.width / data.length +1)
      .attr("width", d => this.width / data.length )
      .attr("height", d => this.height - yScale(d[1]))
      .attr("class", "bar")
      .attr("fill", "#33ADFF")
      .attr("data-date", d => d[0])
      .attr("data-gdp", d => d[1])
      .on('mousemove', function(d) {
        tooltip
          .style("opacity", 1)
          .style("left", d3.event.x + "px")
          .style("top", d3.event.y + "px")
          .html(`
            <p>Date: ${d[0]} <br/> GDP: ${d[1]} </p>
          `)
          .attr("data-date", d[0])
          .attr("data-gdp", d[1])
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale));
    this.svg.append("g")
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale));
  }

  getElementSize() {
    let style = this.canvas.currentStyle || window.getComputedStyle(this.canvas)
    this.margin = {
      top: style.marginTop, bottom: style.marginBottom,
      left: style.marginLeft, right: style.marginRight
    }
    console.log(this)
    this.width = this.canvas.parentElement.offsetWidth - Util.pxToInt(this.margin.left) - Util.pxToInt(this.margin.right)
    this.height = this.canvas.parentElement.offsetHeight - Util.pxToInt(this.margin.top) - Util.pxToInt(this.margin.bottom)
  }
}
