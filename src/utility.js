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
  convertData: data => Object.keys(data).map(key => [new Date(key), data[key]]),
  roundDate: date => {
    if (date.getHours() >= 12) date.setDate(date.getDate() + 1)
    date.setHours(0,0,0,0)
    return date
  }
}
