import { Util } from '../util/utility.js'
import { Country } from '../models/country.js';
import { loadingScreen } from '../ui/loadingScreen.js'

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dateRange = []
    this.dataInitializationPromise = this.prepareData()
  }

  getFocusedCountries() {
    return ['France','Spain','Germany','Netherlands','Czech Republic','Poland','Italy','United Kingdom','Ireland','Denmark','Norway','Sweden','Finland','United States','Canada','China','India']
  }
  

  async prepareData() {
    loadingScreen.updateText('Loading Google Charts')
    google.charts.load('current', {'packages':['corechart']});
    await google.charts.setOnLoadCallback(() => {})
    loadingScreen.updateText('Google Charts loaded')
    loadingScreen.updateText('Getting ECDC data')
    this.dataSet = await fetch('https://aeonds.com/api/full_data',{method: 'GET'}).then(res => res.json())
    loadingScreen.updateText('ECDC Data Loaded')
    this.dataInitialized = true;
    this.dateRange = this.getCountryData('Denmark').cases.map(d => d[0])
    this.createCountries()
    const countriesAPIResponse = await fetch('https://restcountries.eu/rest/v2/alpha?codes=FR;ESP;DE;NL;CZ;PL;IT;GB;IRL;DK;NO;SE;FI;US;CA;CN;IND',{method: 'GET'}).then(res => res.json())
    loadingScreen.updateText('Getting country data')
    countriesAPIResponse.find(country => country.alpha2Code === 'GB').name = 'United Kingdom'
    countriesAPIResponse.find(country => country.alpha2Code === 'US').name = 'United States'
    loadingScreen.updateText('Mergeing country data')
    for (const country of countriesAPIResponse) {
      this.getCountry(country.name).data = country
    }
    return this.dataSet
  }

  createCountries() {
    this.countries = []
    for (const country of this.getFocusedCountries()) {
      this.countries.push(new Country(country, Util.defaultColors[country], this.getCountryData(country)))
      loadingScreen.updateText(`Processing data for ${country}`)
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

  getAllCountriesTable(title, dataFunction) {
    const data = [['Country', title]]
    for (const country of this.countries) {
      data.push([country.data.alpha2Code, country[dataFunction]()])
    }
    return google.visualization.arrayToDataTable(data)
  }
}

export let dataService = new DataService();
