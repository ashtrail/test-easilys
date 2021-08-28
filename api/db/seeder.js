const seeds = require('./seeds')

const { createMany } = require('../src/match/match.service')

createMany(seeds)
  .then(() => {
    console.log(
      `\nDatabase successfully seeded for ${process.env.NODE_ENV} environment.`
    )
    process.exit(0)
  })
  .catch((error) => {
    console.log('\nError : ', error)
    process.exit(1)
  })
