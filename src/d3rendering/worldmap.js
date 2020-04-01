export class WorldMap {
    constructor(elementID) {
        this.element = document.querySelector(elementID)
        const projection = d3.geoEqualEarth()
        this.getElementSize
        this.path = d3.geoPath(projection);
        this.svg = d3.select(elementID)
            .append('g')
            .attr('class', 'map');

        this.svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(['USA',1])
            .enter().append("path")
            .attr("d", this.path)
            .style("fill", 'red')
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity", 0.8)
            // tooltips
            .style("stroke", "white")
            .style('stroke-width', 0.3)
    }

    getElementSize() {
      let style = this.element.currentStyle || window.getComputedStyle(this.element)
      this.margin = fixedMargin
      this.width = this.element.parentElement.offsetWidth - this.margin.left - this.margin.right
      this.height = this.element.parentElement.offsetHeight - this.margin.top - this.margin.bottom
    }
}