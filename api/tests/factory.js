const matchService = require('../src/match/match.service')

class MatchFactory {
  constructor() {
    this.iterator = 1
  }

  generateName() {
    const name = `Match ${this.iterator}`
    this.iterator++
    return name
  }

  build(options = {}) {
    const match = {}
    match['name'] = 'name' in options ? options['name'] : this.generateName()
    match['completed'] = 'completed' in options ? options['completed'] : false
    return match
  }

  async create(options = {}) {
    const obj = this.build(options)
    return await matchService.createOne(obj.name, obj.completed)
  }

  async createMany(nb, options = {}) {
    const matches = []
    for (let i = 0; i < nb; i++) {
      const match = await this.create(options)
      matches.push(match)
    }
    return matches
  }
}

module.exports = MatchFactory
