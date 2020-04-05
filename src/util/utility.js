import { dataService } from '../data/data.js'
export const Util = {
  colors: [
    '#488f31',
    '#c0af4a',
    '#e56b4e',
    '#ef9556',
    '#f4bd6a',
    '#88a037',
    '#d43d51'
  ],
  defaultColors: {
    'France': '#003f5c',
    'Spain': '#58508d',
    'Germany': '#ddd47a',
    'Netherlands': '#ff6361',
    'Czech Republic': '#ffa600',
    'Poland': '#488f31',
    'Italy': '#ffe792',
    'United Kingdom': '#de425b',
    'Ireland': '#ec6758',
    'Denmark': '#bc5090',
    'Norway': '#f95d6a',
    'Sweden': '#255e7e',
    'Finland': '#005de8',
    'United States': '#f5bc6b',
    'Canada': '#00cfe3',
    'China': '#665191',
    'India': '#255e7e',
  },
  defaultColorsArray: [
    '#003f5c',
    '#58508d',
    '#ddd47a',
    '#ff6361',
    '#ffa600',
    '#488f31',
    '#ffe792',
    '#de425b',
    '#ec6758',
    '#bc5090',
    '#f95d6a',
    '#255e7e',
    '#005de8',
    '#f5bc6b',
    '#00cfe3',
    '#665191',
    '#255e7e',
  ],
  convertData: data => Object.keys(data).map(key => [new Date(key), data[key]]),
  roundDate: date => {
    if (date.getHours() >= 12) date.setDate(date.getDate() + 1)
    date.setHours(0,0,0,0)
    return date
  },
  appendElement: (target, type, content, cssClass) => {
    let element = document.createElement(type)
    target.appendChild(element)
    element.innerHTML = content
    if (cssClass) element.setAttribute('class', cssClass)
    return element
  },
  gerateDataTable: (columns, rows) => {
    const dataTable = new google.visualization.DataTable()
    for (const column of columns)
      dataTable.addColumn(...column)
    dataTable.addRows(rows)
    return dataTable
  }
}
