export class Country {
    constructor(name, color, data) {
        this.name = name
        this.color = color
        this.baseData = data
    }

    getName() {
        return this.name
    }

    getColor() {
        return this.color
    }
}