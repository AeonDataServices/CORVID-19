export class PageManager {
	constructor(query) {
		this.element = document.querySelector(query)
		this.hidePages()
		console.log(this.element)
		for (const listObject of this.element.querySelectorAll('.pageLink')) {
			const link = listObject.querySelector('a')
			link.addEventListener('click', this.changePage.bind(this))
			const target = link.getAttribute('href')
			if (listObject.classList.contains('active')) document.querySelector(target).style.display = 'block'
		}
	}

	hidePages() {
		this.getPages().forEach(page => {
			page.style.display = 'none'
		})
	}

	getPages() {
		return Array.from(this.element.querySelectorAll('.pageLink a')).map(link => document.querySelector(link.getAttribute('href')))
	}

	changePage(event) {
		const eventTarget = event.target.getAttribute('href')
		this.hidePages()
		for (const listObject of this.element.querySelectorAll('.pageLink')) {
			const link = listObject.querySelector('a')
			link.addEventListener('click', this.changePage.bind(this))
			const target = link.getAttribute('href')
			if (target === eventTarget) {
				document.querySelector(target).style.display = 'block'
				listObject.classList.add('active')
			} else {
				listObject.classList.remove('active')
			}
		}
	}
}