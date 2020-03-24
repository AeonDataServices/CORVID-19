import { data } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
data.getDataSet().then(data => {
  console.log(data)
  let chart = new D3Chart("#chartSvg", "#chartTooltip")
  let convert = data => Object.keys(data).map(key => [key, data[key]])
  chart.addGraph(new D3Graph('Sweden', convert(data.cases.Sweden), colors.BLUE))
  chart.addGraph(new D3Graph('Denmark', convert(data.cases['Denmark']), colors.GREEN))
  chart.addGraph(new D3Graph('Norway', convert(data.cases['Norway']), colors.RED))
  chart.addGraph(new D3Graph('Netherlands', convert(data.cases['Netherlands']), colors.ORANGE))
  chart.draw()
})
