class View {
  constructor(onDelete) {
    this.matches = document.getElementById("matches");
    this.activeMatches = document.getElementById("match-number");
    this.onDelete = onDelete;
  }

  createMatch({ id, name, completed }) {
    const item = document.createElement("li");
    item.className = "match";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;

    const textDiv = document.createElement("div");
    textDiv.className = "match-name";
    textDiv.textContent = name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.onclick = () => {
      this.onDelete(id);
    };

    item.appendChild(checkbox);
    item.appendChild(textDiv);
    item.appendChild(deleteButton);

    return item;
  }

  clearMatches() {
    while (this.matches.firstChild) {
      this.matches.removeChild(this.matches.firstChild);
    }
  }

  updateMatches(matches) {
    this.clearMatches();

    let activeMatches = 0;
    for (let match of matches) {
      const li = this.createMatch(match);
      this.matches.appendChild(li);
      if (!match.completed) activeMatches++;
    }

    // TODO: update active matches number on check / uncheck
    this.activeMatches.textContent = activeMatches.toString();
  }
}
