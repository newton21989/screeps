const array = [
  "Nellie", 
  "Optimus", 
  "Ultron",
  "Eve",
  "Kronos",
  "Klaatu",
  "Turing",
  "Jobs",
  "Woz",
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
  "Jen",
  "Bradbury",
  "Elon",
  "Grok",
  "X Æ A-12",
  "Darmok",
  "Jalad",
  "Picard",
  "Frakes",
  "Madden",
  "Rubb",
  "Dude",
  "Sweet",
  "Aldus",
  "Geddy",
  "Busta",
  "Hiro-san",
  "Sy Greenblum",
  "Otto"
]

let genName = {
  /** @return {string} */
  getRandom: function() {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = genName;