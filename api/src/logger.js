module.exports = (message, data) => {
  if (process.env.NODE_ENV !== 'test') {
    if (data) {
      console.log(message, data)
    } else {
      console.log(message)
    }
  }
}
