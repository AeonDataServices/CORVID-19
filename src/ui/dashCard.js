import { Util } from "../util/utility.js"

export class DashCard {
	constructor(containerID, title, text) {
		const container = document.querySelector(containerID)
		this.element = Util.appendElement(container, 'div', '', 'card')
		this.content = Util.appendElement(this.element, 'div', '', 'card-content')
		Util.appendElement(this.content, 'span', title, 'card-title')
		Util.appendElement(this.content, 'p', text)
	}
}