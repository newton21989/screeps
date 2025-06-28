let name = require('name');
let utils = require('utils');

let roleRepairman = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      creep.memory.working = false;
      creep.say('🔄 refuel');
    }
    if(!creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
      creep.memory.working = true;
      creep.say('🚧 repair');
    }

    if(creep.memory.working) {
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART && object.hits < object.hitsMax});
      if(target)
      {
        if(creep.repair(target) == ERR_NOT_IN_RANGE)
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
      else if(!target)
      {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.hits < object.hitsMax});
        if(target)
        {
          if(creep.repair(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }
    }
    else {
      let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0} );

      if(source && creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  },

  spawn: function(spawner, sourceid)
  {
    let energy = spawner.room.energyAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1, max: 4 },
        [CARRY]: { min: 1, max: 3 },
        [MOVE]:  { min: 1, max: 3 }
    });

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'repairman', working : false}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn repairman.");
  }
};

module.exports = roleRepairman;