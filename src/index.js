import { dataService } from './data.js'
import { D3Chart } from './d3chart.js'
import { D3Graph, colors } from './d3graph.js'
import { UIManager } from './UIManager.js'
document.addEventListener('DOMContentLoaded', () => {
  dataService.isDataInitialized().then(() => {
    new UIManager('#mainDisplay')
  })
})
