export const Util = {
  defaultColorsArray: [
    '#0081FF',
    '#488f31',
    '#00cfe3',
    '#665191',
    '#ffa600',
    '#bc5090',
    '#005de8',
    '#003f5c',
    '#ddd47a',
    '#255e7e',
    '#ec6758',
    '#ffe792',
    '#ff6361',
    '#f95d6a',
    '#58508d',
    '#488f31',
    '#255e7e',
    '#FF92FD',
    '#de425b',
    '#f5bc6b'
  ],
  convertData: data => Object.keys(data).map(key => [new Date(key), data[key]]),
  roundDate: date => {
    if (date.getHours() >= 12) date.setDate(date.getDate() + 1)
    date.setHours(0,0,0,0)
    return date
  },
  // appendElement: (target, type, content, cssClass) => {
  //   let element = document.createElement(type)
  //   target.appendChild(element)
  //   element.innerHTML = content
  //   if (cssClass) element.setAttribute('class', cssClass)
  //   return element
  // },
  appendElement: (target, type, content, cssClass, cssId) => {
    let element = document.createElement(type)
    target.appendChild(element)
    element.innerHTML = content
    if (cssClass) element.setAttribute('class', cssClass)
    if (cssId) element.setAttribute('id', cssId)
    return element
  },
  gerateDataTable: (columns, rows) => {
    const dataTable = new google.visualization.DataTable()
    for (const column of columns)
      dataTable.addColumn(...column)
    dataTable.addRows(rows)
    return dataTable
  },
  isToday: (date) => {
    const today = new Date()
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
  },
  commaSeparatedNumber: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
