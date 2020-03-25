import { data } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
data.getDataSet().then(data => {
  console.log(data)
  let chart = new D3Chart("#chartSvg", "#chartTooltip")
  //for (let line of data.WHODATA) {
  //  chart.addGraph(new D3Graph(line.confirmed, colors.BLUE))
  //}
  chart.addGraph(new D3Graph('Denmark', data.full_cases.denmark, colors.BLUE))
  chart.addGraph(new D3Graph('Netherlands', data.cfull_ases.netherlands, colors.GREEN))
  chart.addGraph(new D3Graph('Norway', data.full_cases.norway, colors.RED))
  chart.draw()
})
