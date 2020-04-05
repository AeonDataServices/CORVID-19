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
	}

	hidePages() {
		this.getPages().forEach(page => {
			page.style.display = 'none'
		})
	}

	getPages() {
		return Array.from(this.element.querySelectorAll('.pageLink')).map(link => document.querySelector(link.getAttribute('href')))
	}

	changePageEvent(event) {
		const eventTarget = event.target.getAttribute('href')
		this.changePage(eventTarget)
		// for (const listObject of this.element.querySelectorAll('.pageLink')) {
		// 	const link = listObject.querySelector('a')
		// 	link.addEventListener('click', this.changePage.bind(this))
		// 	const target = link.getAttribute('href')
		// 	if (target === eventTarget) {
		// 		document.querySelector(target).style.display = 'block'
		// 		listObject.classList.add('active')
		// 	} else {
		// 		listObject.classList.remove('active')
		// 	}
		// }
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