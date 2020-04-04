import { Util } from '../util/utility.js'
import { Country } from '../models/country.js';
import { loadingScreen } from '../ui/loadingScreen.js'
import { env } from '../.env.js';

class DataService {
  constructor() {
    this.dataSet = {}
    this.dataInitialized = false;
    this.dataInitializationPromise = this.prepareData()
    this.validCountries = []
  }


  generateValidCountries() {
    const alpha3codes = Object.keys(this.countriesAPIAlpha3Lookup)
    const validCountries = []
    for (const countryName of Object.keys(this.dataSet)) {

      if (alpha3codes.includes(this.dataSet[countryName].alpha3)) validCountries.push(countryName)
    }
    console.log(this.dataSet, validCountries)
    this.validCountries = validCountries
  }

  getFocusedCountries() {
    //return this.validCountries
    return ['France','Spain','Germany','Netherlands','Czech Republic','Poland','Italy','United Kingdom','Ireland','Denmark','Norway','Sweden','Finland','United States','Canada','China','India']
  }

  getAvailabeTableNames() {
    return ['cases', 'newCases', 'casesPct', 'deaths', 'newDeaths', 'deathRate']
  }

  async prepareData() {
    loadingScreen.updateText('Loading Google Charts')
    google.charts.load('current', {'packages':['corechart', 'geochart'], 'mapsAPIKey': 'AIzaSyBubQskFIfulv53q2el9iDI41xfwegzmSI', other_params: `key=${env.mapsAPI}`});
    await google.charts.setOnLoadCallback(() => {})
    loadingScreen.updateText('Google Charts loaded')
    loadingScreen.updateText('Getting ECDC data')
    this.dataSet = await fetch('https://aeonds.com/api/full_data',{method: 'GET'}).then(res => res.json())
    loadingScreen.updateText('ECDC Data Loaded')
    loadingScreen.updateText('Getting country data')
    const countriesAPIResponse = await fetch('https://restcountries.eu/rest/v2/all',{method: 'GET'}).then(res => res.json())
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
    for (const country of this.getFocusedCountries()) {
      this.countries.push(new Country(country, Util.defaultColors[country], this.getCountryData(country)))
      loadingScreen.updateText(`Processing data for ${country}`)
    }
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
      data.push([country.miscData.alpha2code, country[dataFunction]()])
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
