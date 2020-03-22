import { data } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
data.getDataSet().then(data => {
  console.log(data)
  let chartData = data.WHODATA[147];
  let chart = new D3Chart("#chartSvg", "#chartTooltip")
  //for (let line of data.WHODATA) {
  //  chart.addGraph(new D3Graph(line.confirmed, colors.BLUE))
  //}
  chart.addGraph(new D3Graph('Denmark', data.WHODATA[42].confirmed, colors.BLUE))
  chart.addGraph(new D3Graph('Netherlands', data.WHODATA[107].confirmed, colors.GREEN))
  chart.addGraph(new D3Graph('Norway', data.WHODATA[108].confirmed, colors.RED))
  chart.draw()
})
