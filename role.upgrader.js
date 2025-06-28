let name = require('name');
let utils = require('utils');

let roleUpgrader = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.refuel == false && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.refuel = true;
      creep.say('🔄 refuel');
    }
    if(creep.memory.refuel == true && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity(RESOURCE_ENERGY)) {
      creep.memory.refuel = false;
      creep.say('🆙 upgrade');
    }
    
    if(creep.memory.working == false && creep.room.controller.level < 8)
      creep.memory.working = true;
    if(creep.memory.working == true && creep.room.controller.level >= 8)
      creep.memory.working = false;

    if(creep.memory.working) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0000ff'}});
      }
    }
    if(creep.memory.refuel) {
      let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0} );
        
      if(source && creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#0000ff'}});
      else if(!source)
      {
      source = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (object) => object.memory.transferring});
      if(source)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  
  spawn: function(spawner, sourceid)
  {
    let energy = spawner.room.energyAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1, max: 5 },
        [CARRY]: { min: 1, max: 7 },
        [MOVE]:  { min: 1, max: 7 }
    });

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'upgrader', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn upgrader.");
  }
};

module.exports = roleUpgrader;