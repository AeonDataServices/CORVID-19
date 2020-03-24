class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dataInitializationPromise = this.prepareData()
  }

  async prepareData() {
    let cases = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/total_cases.json').then(res => res.json())
    let deaths = await fetch('https://raw.githubusercontent.com/Range-Point/Covid-Data-Pipeline/master/json/total_deaths.json').then(res => res.json())
    this.dataSet = {'cases': cases, 'deaths': deaths}
    this.dataInitialized = true;
    return this.dataSet
  }

  processInput(source, origin) {
    return d3.json(source)
  }

  getDataSet() {
    return this.dataSet
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let dataService = new DataService();
