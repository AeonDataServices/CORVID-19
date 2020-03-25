import { Util } from './utility.js'

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dataInitializationPromise = this.prepareData()
  }

  async prepareData() {
    let cases = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/total_cases.json').then(res => res.json())
    let casesKeys = Object.keys(cases)
    for (let singleCase of casesKeys) cases[singleCase] = Util.convertData(cases[singleCase])
    let deaths = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/total_deaths.json').then(res => res.json())
    let deathsKeys = Object.keys(deaths)
    for (let death of deathsKeys) deaths[death] = Util.convertData(deaths[death])
    this.dataSet = {'cases': cases, 'deaths': deaths}
    console.log(this.dataSet)
    this.dataInitialized = true;
    return this.dataSet
  }

  processInput(source, origin) {
    return d3.json(source)
  }

  getDataSet() {
    return this.dataSet
  }

  getDateRange() {
    return this.dataSet.cases.Denmark.map(d => d[0])
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let dataService = new DataService();
