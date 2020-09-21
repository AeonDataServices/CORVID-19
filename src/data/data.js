import { Util } from '../util/utility.js'
import { Country } from '../models/country.js';
import { loadingScreen } from '../ui/loadingScreen.js'

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false
    loadingScreen.updateText('Starting data service')
    this.dataInitializationPromise = this.prepareData()
    this.validCountries = []
  }


  generateValidCountries() {
    const alpha3codes = Object.keys(this.countriesAPIAlpha3Lookup)
    const validCountries = []
    for (const countryName of Object.keys(this.dataSet)) {

      if (alpha3codes.includes(this.dataSet[countryName].alpha3)) validCountries.push(countryName)
    }
    this.validCountries = validCountries
  }

  getFocusedCountries() {
    //return this.validCountries
    // ,'Czech Republic'
    return ['Australia', 'Belgium', 'Canada', 'China', 'Czechia', 'Denmark', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Ireland', 'Italy',
            'Netherlands', 'Norway', 'Poland', 'Spain', 'South Korea', 'Sweden', 'Turkey', 'United Kingdom', 'United States']
  }

  getValidCountries() {
    return this.validCountries
  }

  getAvailabeTableNames() {
    return ['cases', 'newCases', 'casesPct', 'deaths', 'newDeaths', 'deathRate']
  }

  async prepareData() {
    loadingScreen.updateText('Loading Google Charts')
    google.charts.load('current', {'packages':['corechart', 'geochart']});
    await google.charts.setOnLoadCallback(() => {})
    loadingScreen.updateText('Google Charts loaded')
    loadingScreen.updateText('Getting ECDC data')
    this.dataSet = await fetch('https://aeonds.com/api/full_data',{method: 'GET'}).then(res => res.json())
    console.log(this.dataSet)
    loadingScreen.updateText('ECDC Data Loaded')
    loadingScreen.updateText('Getting country data')
    const countriesAPIResponse = await fetch('https://restcountries.eu/rest/v2/all',{method: 'GET'}).then(res => res.json())
    console.log(countriesAPIResponse);
    //loadingScreen.updateText('Getting recovery data')
    //const recoveriesAPIResponse = await fetch('https://aeonds.com/api/recovery_data',{method: 'GET'}).then(res => res.json())
    const recoveriesAPIResponse = {};
    //loadingScreen.updateText('Getting government measures data')
    //this.containmentMeasures = await fetch('https://aeonds.com/api/containment_measures',{method: 'GET'}).then(res => res.json())
    this.containmentMeasures = {};
    for (const country of Object.keys(this.dataSet)) {
      if(recoveriesAPIResponse[country]) this.dataSet[country].recoveries = recoveriesAPIResponse[country].recovered
    }
    loadingScreen.updateText('Mergeing country data')
    this.countriesAPIAlpha3Lookup = {}
    for (const country of countriesAPIResponse) {
      this.countriesAPIAlpha3Lookup[country.alpha3Code] = country
    }
    this.generateValidCountries()
    this.createCountries()
    this.dataInitialized = true;
    return this.dataSet
  }

  createCountries() {
    this.countries = []
    for (const [index, country] of this.getFocusedCountries().entries()) {
      loadingScreen.updateText(`Processing data for ${country}`)
      this.countries.push(new Country(country, Util.defaultColorsArray[index % Util.defaultColorsArray.length], this.getCountryData(country)))
    }
    console.log(this.countries)
  }

  getCountry(name) {
    return this.countries.find(country => country.getName() === name)
  }
  getCountryAlpha3(alpha3code) {
    return this.countries.find(country => country.getAlpha3Code() === alpha3code)
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
      for (let subset of this.getAvailabeTableNames()) {
        console.log(subset);
        country[subset] = country[subset].map(d => {
          const date = new Date(d[0])
          date.setHours(0,0,0,0)
          return [date, Math.round(d[1])]
        })
      }
    return country
  }

  isDataInitialized() {
    return (this.dataInitialized) ? new Promise(resolve => resolve(this.dataSet)) : this.dataInitializationPromise
  }

  getAllCountriesTable(title, dataFunction) {
    const data = [['Country', title]]
    for (const country of this.countries) {
      data.push([country.miscData.name, country[dataFunction]()])
    }
    return google.visualization.arrayToDataTable(data)
  }

  getGlobalNewCases() {
    return this.countries.reduce((accumulator, country) => accumulator += country.getRecentGrowth(), 0) / this.countries.length
  }

  getGlobalDeathRate() {
    return this.countries.reduce((accumulator, country) => accumulator += country.getTotalDeathRate(), 0) / this.countries.length
  }
}

export let dataService = new DataService();
