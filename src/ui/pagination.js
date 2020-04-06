export class PageManager {
	constructor(query) {
		this.element = document.querySelector(query)
		for (const listObject of this.element.querySelectorAll('nav li')) {
			const link = listObject.querySelector('a')
			if (listObject.classList.contains('active')) {
				this.changePage(link.getAttribute('href'))
				break
			}
		}
		for (const link of this.element.querySelectorAll('.pageLink')) {
			link.addEventListener('click', this.changePageEvent.bind(this))
		}
		this.loadPageFromURL()
	}

	loadPageFromURL() {
		if (this.getPageIDs().includes(window.location.hash)) this.changePage(window.location.hash)
	}

	hidePages() {
		this.getPages().forEach(page => {
			page.style.display = 'none'
		})
	}

	getPageIDs() {
		return Array.from(this.element.querySelectorAll('.pageLink')).map(link => link.getAttribute('href'))
	}

	getPages() {
		return Array.from(this.element.querySelectorAll('.pageLink')).map(link => document.querySelector(link.getAttribute('href')))
	}

	changePageEvent(event) {
		const eventTarget = event.target.getAttribute('href')
		this.changePage(eventTarget)
	}

	changePage(page) {
		this.hidePages()
		for (const listObject of this.element.querySelectorAll('nav li')) {
			const link = listObject.querySelector('a').getAttribute('href')
			if (link === page) {
				listObject.classList.add('active')
			} else {
				listObject.classList.remove('active')
			}
		}
		document.querySelector(page).style.display = 'block'
	}
}