import { Util } from '../util/utility.js'
import { Country } from '../models/country.js';
import { loadingScreen } from '../ui/loadingScreen.js'

const testMeasuresData = {
  France: {
    venuesClosed: [new Date('2020-03-12'), 'star', 'Venues Closed'],
  },
  Spain: {
    venuesClosed: [new Date('2020-03-15'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-27'), 'triangle', 'Borders Closed'],
  },
  Germany: {
    bordersClosed: [new Date('2020-03-26'), 'triangle', 'Borders Closed'],
  },
  Netherlands: {
    venuesClosed: [new Date('2020-03-15'), 'star', 'Venues Closed'],
  },
  'Czech Republic': {
    venuesClosed: [new Date('2020-03-12'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-12'), 'triangle', 'Borders Closed'],
  },
  Poland: {
    venuesClosed: [new Date('2020-03-10'), 'star', 'Venues Closed'],
  },
  Italy: {
    venuesClosed: [new Date('2020-03-08'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-09'), 'triangle', 'Borders Closed'],
  },
  'United Kingdom': {
    venuesClosed: [new Date('2020-03-16'), 'star', 'Venues Closed'],
  },
  Ireland: {
    venuesClosed: [new Date('2020-03-15'), 'star', 'Venues Closed'],
  },
  Denmark: {
    venuesClosed: [new Date('2020-03-13'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-14'), 'triangle', 'Borders Closed'],
  },
  Norway: {
    venuesClosed: [new Date('2020-03-12'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-26'), 'triangle', 'Borders Closed'],
  },
  Sweden: {
  },
  Finland: {
    venuesClosed: [new Date('2020-03-16'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-19'), 'triangle', 'Borders Closed'],
  },
  'United States': {
  },
  Canada: {
  },
  India: {
    venuesClosed: [new Date('2020-03-22'), 'star', 'Venues Closed'],
    bordersClosed: [new Date('2020-03-23'), 'triangle', 'Borders Closed'],
  },
}

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
    return ['Belgium', 'France','Spain','Germany','Netherlands', 'Czechia','Poland','Italy','United Kingdom','Ireland','Denmark','Norway','Sweden','Finland','United States','Canada','China','India']
  }

  getAvailabeTableNames() {
    return ['cases', 'newCases', 'casesPct', 'deaths', 'newDeaths', 'deathRate','recoveries']
  }

  async prepareData() {
    loadingScreen.updateText('Loading Google Charts')
    google.charts.load('current', {'packages':['corechart', 'geochart']});
    await google.charts.setOnLoadCallback(() => {})
    loadingScreen.updateText('Google Charts loaded')
    loadingScreen.updateText('Getting ECDC data')
    this.dataSet = await fetch('https://aeonds.com/api/full_data',{method: 'GET'}).then(res => res.json())
    loadingScreen.updateText('ECDC Data Loaded')
    loadingScreen.updateText('Getting country data')
    const countriesAPIResponse = await fetch('https://restcountries.eu/rest/v2/all',{method: 'GET'}).then(res => res.json())
    loadingScreen.updateText('Getting recovery data')
    const recoveriesAPIResponse = await fetch('https://aeonds.com/api/recovery_data',{method: 'GET'}).then(res => res.json())
    for (const country of Object.keys(this.dataSet)) {
      if(recoveriesAPIResponse[country]) this.dataSet[country].recoveries = recoveriesAPIResponse[country].recovered
      if(testMeasuresData[country]) this.dataSet[country].measures = testMeasuresData[country]
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
    for (const country of this.getFocusedCountries()) {
      loadingScreen.updateText(`Processing data for ${country}`)
      this.countries.push(new Country(country, Util.defaultColors[country], this.getCountryData(country)))
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
