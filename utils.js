
let utils = {
  /**
   * Generates a creep body based on energy and part count constraints.
   * 
   * @param {number} energy - Available energy to spend
   * @param {Object} constraints - Part constraints by type
   * @returns {string[]} - Array of body parts (e.g., [WORK, CARRY, MOVE])
   */  
  generateBody: function(energy, constraints) {
    const body = [];
    const costs = BODYPART_COST;

    // Step 1: Add required minimum parts
    for (const part in constraints) {
      const min = constraints[part].min || 0;
      for (let i = 0; i < min; i++) {
        if (energy >= costs[part]) {
          body.push(part);
          energy -= costs[part];
        } else {
          console.log(`generateBody: Not enough energy for minimum ${part}`);
          return []; // Cannot meet required minimum
        }
      }
    }

    // Step 2: Add parts up to max
    let added = true;
    while (added) {
      added = false;
      for (const part in constraints) {
        const { min = 0, max = min } = constraints[part];
        const current = body.filter(p => p === part).length;
        if (current < max && energy >= costs[part]) {
          body.push(part);
          energy -= costs[part];
          added = true;
        }
      }
    }

    return body;
  }
}

module.exports = utils;
