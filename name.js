var array = [
  "Nellie", 
  "Optimus", 
  "Ultron",
  "Eve",
  "Kronos",
  "Klaatu",
  "Turing",
  "Jobs",
  "Bender",
  "Rosie",
  "Enigma",
  "Babel",
  "Tesla",
  "Kepler",
  "Newton",
  "Asimov",
  "Verne",
  "Pi",
  "Ampere",
  "Hawking",
  "Sheldon",
  "Padme",
  "Clara",
  "Rey",
  "Jen"
]

var genName = {
  /** @return {string} */
  getRandom: function() {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = genName;