export class D3Chart {
  constructor(containerID, data) {
    console.log(data)
    let margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
    this.svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    const yScale = d3.scaleLinear()
                  .range([height, 0])
                  .domain([0, d3.max(data, d => d[1])]);

    const xScale = d3.scaleTime()
                    .range([0, width])
                    .domain( d3.extent(data, d => {return new Date(d[0])} ));
    this.svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d[1]))
      .attr("x", (d,i) => i * width / data.length +1)
      .attr("width", d => width / data.length )
      .attr("height", d => height - yScale(d[1]))
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
      .attr("transform", "translate(0," + height + ")")
      .attr("id", "x-axis")
      .call(d3.axisBottom(xScale));
    this.svg.append("g")
      .attr("id", "y-axis")
      .call(d3.axisLeft(yScale));
  }
}
