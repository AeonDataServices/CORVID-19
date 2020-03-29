export const colors = {
  BLUE: 'steelBlue',
  GREEN: 'DarkGreen',
  RED: 'Red',
  ORANGE: 'Orange'
}

export class D3Graph {
  constructor(label, data, color, style = '') {
    this.label = label
    this.data = data
    this.color = color
    this.style = style
  }

  draw(chart) {
    chart.svg.append("path")
      .datum(this.getDomainData(chart.domain))
      .attr("fill", "none")
      .attr("stroke", this.color)
      .attr("stroke-width", 1.5)
      .attr("d", chart.line)
      .style(...this.style)
  }

  getDomainData(domain) {
    return this.data.filter(dataPoint => dataPoint[0] >= domain[0] && dataPoint[0] <= domain[1])
  }
}
