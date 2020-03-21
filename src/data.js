class Data {
  constructor() {
    this.dataInitialized = false;
    this.dataInitializationPromise = this.prepareData()
  }

  async prepareData() {
    let WHOData = await this.processInput('./data/cntry_stat_who_wp.json')
    let ECDCData = await this.processInput('./data/cntry_stat_ecdc_wp.json')
    let OWIDData = await this.processInput('./data/cntry_stat_owid.json')
    this.dataSet = {'WHODATA': WHOData, 'ECDCData': ECDCData, 'OWIDData': OWIDData}
    this.dataInitialized = true;
    return this.dataSet
  }

  processInput(source, origin) {
    return d3.json(source)
  }

  getDataSet() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let data = new Data();
