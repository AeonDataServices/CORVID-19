import { data } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
data.getDataSet().then(data => {
  console.log(data)
  let chart = new D3Chart("#chartSvg", "#chartTooltip")
  let convert = data => Object.keys(data).map(key => [key, data[key]])
  chart.addGraph(new D3Graph('Denmark', data.cases.denmark, colors.BLUE))
  chart.addGraph(new D3Graph('Netherlands', data.cases.netherlands, colors.GREEN))
  chart.addGraph(new D3Graph('Norway', data.cases.norway, colors.RED))
  chart.draw()
})
