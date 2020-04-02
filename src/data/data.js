import { Util } from '../util/utility.js'
import { Country } from '../models/country.js';

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dateRange = []
    this.dataInitializationPromise = this.prepareData()
  }

  getFocusedCountries() {
    return ['France','Spain','Germany','Netherlands','Czech Republic','Poland','Italy','United Kingdom','Ireland','Denmark','Norway','Sweden','Finland','United States','Canada','China']
  }

  async prepareData() {
    this.dataSet = await fetch('https://aeonds.com/api/full_data',{method: 'GET'}).then(res => res.json())
    this.dataInitialized = true;
    this.dateRange = this.getCountryData('Denmark').cases.map(d => d[0])
    this.createCountries()
    return this.dataSet
  }

  createCountries() {
    this.countries = []
    for (const country of this.getFocusedCountries()) {
      this.countries.push(new Country(country, Util.defaultColors[country], this.getCountryData(country)))
    }
  }

  getCountry(name) {
    return this.countries.find(country => country.getName() === name)
  }

  getCountries() {
    return this.countries
  }

  getDataSet() {
    let dataToReturn = {}
    for (let country of this.getFocusedCountries()) dataToReturn[country] = this.dataSet[country]
    return dataToReturn
  }

  getCountryData(countryName) {
    let country = this.dataSet[countryName]
    if (typeof country.cases[0][0] === 'string')
      for (let subset of Object.keys(country)) country[subset] = country[subset].map(d => {
        const date = new Date(d[0])
        date.setHours(0,0,0,0)
        return [date, Math.round(d[1])]
      })
    return country
  }

  getDateRange() {
    return this.dateRange
  }

  getDateIndex(searchDate) {
    return this.dateRange.findIndex(date => date.getTime() === searchDate.getTime())
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }
}

export let dataService = new DataService();
