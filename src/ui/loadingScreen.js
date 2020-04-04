import { Util } from "../util/utility.js"

export class LoadingScreen {
	constructor(loadingScreenID, classesToHide) {
		this.loadingScreen = document.querySelector(loadingScreenID)
		this.content = document.querySelectorAll(classesToHide)
	}

	startLoading() {
		this.loadingScreen.style.display = 'flex'
		this.content.forEach(element => element.style.display = 'none')
		this.loadingScreen.querySelector('.updates').innerHTML = ''
	}

	finishLoading() {
		this.loadingScreen.style.display = 'none'
		this.content.forEach(element => element.style.display = 'block')
	}
	
	updateText(text) {
		Util.appendElement(this.loadingScreen.querySelector('.updates'), 'span', `${text} <br/>`)
	}

	updateProgress(progress) {
		this.loadingScreen.style.width = `${progress}%`
	}
}

export const loadingScreen = new LoadingScreen('#loadingPlaceholder', '.chartList')