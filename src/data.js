import { Util } from './utility.js'

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dateRange = []
    this.dataInitializationPromise = this.prepareData()
  }

  async prepareData() {
    this.dataSet = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/full_data.json').then(res => res.json())
    console.log(this.dataSet)
    this.dataInitialized = true;
    this.dateRange = this.getCountryData('Denmark').cases.map(d => d[0])
    return this.dataSet
  }

  getDataSet() {
    return this.dataSet
  }

  getCountryData(countryName) {
    let country = this.dataSet[countryName]
    if (typeof country.cases[0][0] === 'string')
      for (let subset of Object.keys(country)) country[subset] = country[subset].map(d => [new Date(d[0]), d[1]])
    return country
  }

  getDateRange() {
    return this.dateRange
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let dataService = new DataService();
