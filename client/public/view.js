/* eslint-disable-next-line no-unused-vars */
class View {
  constructor(document, onDelete) {
    this.document = document
    this.matches = this.document.getElementById('matches')
    this.activeMatches = this.document.getElementById('match-number')
    this.onDelete = onDelete
  }

  createMatch({ id, name, completed }) {
    const item = this.document.createElement('li')
    item.className = 'match'

    const checkbox = this.document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = completed

    const textDiv = this.document.createElement('div')
    textDiv.className = 'match-name'
    textDiv.textContent = name

    const deleteButton = this.document.createElement('button')
    deleteButton.textContent = 'X'
    deleteButton.onclick = () => {
      this.onDelete(id)
    }

    item.appendChild(checkbox)
    item.appendChild(textDiv)
    item.appendChild(deleteButton)

    return item
  }

  clearMatches() {
    while (this.matches.firstChild) {
      this.matches.removeChild(this.matches.firstChild)
    }
  }

  updateMatches(matches) {
    this.clearMatches()

    let activeMatches = 0
    for (let match of matches) {
      const li = this.createMatch(match)
      this.matches.appendChild(li)
      if (!match.completed) activeMatches++
    }

    // TODO: update active matches number on check / uncheck
    this.activeMatches.textContent = activeMatches.toString()
  }
}
