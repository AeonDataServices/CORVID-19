class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dataInitializationPromise = this.prepareData()
  }

  async prepareData() {
    this.dataSet = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/full_data.json').then(res => res.json())
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
    return Object.keys(this.dataSet.cases.Denmark).map(d => new Date(d))
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let dataService = new DataService();
