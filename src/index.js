import { data } from './data.js'
import { D3Chart } from './d3chart.js'
data.getDataSet().then(data => {
  console.log(data)
  let chartData = data.WHODATA[147];
  new D3Chart("#chartSvg", chartData.confirmed)
})
