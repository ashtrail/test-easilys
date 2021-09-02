/* eslint-disable-next-line no-unused-vars */
class MatchManager {
  constructor(document, socket, matches = []) {
    this._matches = []
    this.activeMatches = 0

    this.document = document
    this.socket = socket

    this.htmlMatches = document.getElementById('matches')
    this.htmlActiveMatches = document.getElementById('match-number')

    this.initializeForm()
    this.updateMatches(matches)
  }

  get matches() {
    return this._matches
  }

  updateMatches(value) {
    this._matches = value
    let count = 0
    value.forEach((match) => {
      if (!match.completed) count++
    })
    this.activeMatches = count
    this.displayMatches()
  }

  addMatch(newMatch) {
    this.updateMatches([...this.matches, newMatch])
  }

  updateMatch(id, update) {
    const newMatches = this.matches.map((match) =>
      match.id === id ? update : match
    )
    this.updateMatches(newMatches)
  }

  deleteMatch(id) {
    const newMatches = this.matches.filter((match) => match.id !== id)
    this.updateMatches(newMatches)
  }

  initializeForm() {
    const form = this.document.getElementById('form')
    const input = this.document.getElementById('name-input')

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      if (input.value) {
        const newMatch = {
          name: input.value,
          completed: false,
        }
        input.value = ''

        socket.emit('match:create', newMatch, (res) => {
          if (res.status === 'OK') {
            this.addMatch(res.data)
          } else {
            console.log(res.error)
          }
        })
      }
    })
  }

  displayMatch(match) {
    const { id, name, completed } = match
    const item = this.document.createElement('li')
    item.className = 'match'

    const checkbox = this.document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = completed
    checkbox.onclick = () => {
      socket.emit(
        'match:update',
        id,
        { ...match, completed: !completed },
        (res) => {
          if (res.status === 'OK') {
            this.updateMatch(id, res.data)
          } else {
            console.log(res.error)
          }
        }
      )
    }

    const textDiv = this.document.createElement('div')
    textDiv.className = 'match-name'
    textDiv.textContent = name
    if (completed) {
      textDiv.className += ' completed'
    }

    const deleteButton = this.document.createElement('button')
    deleteButton.textContent = 'X'
    deleteButton.onclick = () => {
      socket.emit('match:delete', id, (res) => {
        if (res.status === 'OK') {
          this.deleteMatch(id)
        } else {
          console.log(res.error)
        }
      })
    }

    item.appendChild(checkbox)
    item.appendChild(textDiv)
    item.appendChild(deleteButton)

    return item
  }

  clearMatches() {
    while (this.htmlMatches.firstChild) {
      this.htmlMatches.removeChild(this.htmlMatches.firstChild)
    }
  }

  displayMatches() {
    this.clearMatches()

    for (let match of this.matches) {
      const li = this.displayMatch(match)
      this.htmlMatches.appendChild(li)
    }

    this.htmlActiveMatches.textContent = this.activeMatches.toString()
  }
}
