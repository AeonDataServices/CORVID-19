import { dataService } from "./data.js"

export class ContainmentMeasures {
	constructor(countryName) {
		this.countryName = countryName
		this.countryMeasures = dataService.containmentMeasures.filter(measure => measure.Country === countryName)
		this.fixKnownIssues()
		console.log(this.countryMeasures)
		this.generateMeasuresInfo()
	}

	fixKnownIssues() {
		this.countryMeasures = this.countryMeasures.map(measure => {
			if (!measure['Keywords']) return measure
			if (
				measure['Keywords'].includes('international travel ban - all countries') &&
				measure['Description of measure implemented'].includes('Temporary entry ban to the EU via Sweden')
				) {
					measure['Keywords'] = measure['Keywords'].replace('international travel ban - all countries', 'international travel ban - risk countries')
			}
			console.log(measure)
			return measure
		})
	}

	generateMeasuresInfo() {
		this.createMeasuresInfo('SelfQuarantineAdvise', ['traveller quarantine'], [])
		this.createMeasuresInfo('SocialDistancing', ['social distancing'], [])
		this.createMeasuresInfo('RemoteWork', ['remote work'], [])
		this.createMeasuresInfo('SchoolClosure', ['school closure', 'university closure'], [])
		this.createMeasuresInfo('PublicGatheringsLImit', ['gatherings banned'], [])
		this.createMeasuresInfo('EmergencyState', ['emergency declaration', 'state of emergency'], [])
		this.createMeasuresInfo('limBusinessClosure', ['limited nonessential business suspension', 'general nonessential business suspension'], [])
		this.createMeasuresInfo('fullBusinessClosure', ['closure nonessential stores'], [])
		this.createMeasuresInfo('localLockdown', ['cluster isolation'], [])
		this.createMeasuresInfo('nationalLockdown', ['blanket isolation', 'blanket curfew'], [])
		this.createMeasuresInfo('domesticTravelBan', ['domestic travel ban'], ['domestic travel resumed'])
		this.createMeasuresInfo('riskTravelBan', ['travel ban - risk countries'])
		this.createMeasuresInfo('blanketTravelBan', ['travel ban - all countries'], ['international travel resumed'])
	}

	searchMeasures(keywordsList) {
		return keywordsList.map(keywords => {
				return this.countryMeasures.filter(measure => {
						return (measure['Keywords']) ? measure['Keywords'].includes(keywords) : false
					})
				}
			).reduce(
					((acc, list) => acc.concat(list))
				, [])
	}

	measuresMatchKeywords(measures) {
		return (measure['Keywords']) ? measure['Keywords'].includes(keywords) : false
	}

	createMeasuresInfo(name, startKeywordsList, resumeKeywordsList = []) {
		console.log(name)
		const startList = this.searchMeasures(startKeywordsList)
		const endList = this.searchMeasures(resumeKeywordsList)
		this[name] = {
			active: (startList.length > 0) && (endList.length == 0),
			information: startList.concat(endList)
		}
		if ((startList.length > 0) && (endList.length == 0)) console.log(name, startList, endList)
	}
}