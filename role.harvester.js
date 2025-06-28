let name = require('name');
let utils = require('utils');

let roleHarvester = {
  run: function(creep) {
    if(creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)) {
      creep.memory.working = true;
      creep.say('⏩ transfer');
    }

    if(creep.memory.working) {
      let target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (object) => (object.structureType == STRUCTURE_CONTAINER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0) || (object.structureType == STRUCTURE_LINK && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0) } )
      if(!target && creep.room.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_CONTAINER}).length == 0)
      {
        try {
          target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (object) => object.store.getFreeCapacity(RESOURCE_ENERGY) > 0})
        } catch {}
      }

      if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    else {
      //var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (object) => object.store.getUsedCapacity(RESOURCE_ENERGY) > 0 } );
      let source = Game.getObjectById(creep.memory.source);
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },

  spawn: function(spawner, sourceid)
  {
    let energy = spawner.room.energyCapacityAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1, max: 6 },
        [CARRY]: { min: 1 },
        [MOVE]:  { min: 1 }
    });

    if (spawnParts.length === 0) {
      console.log("Not enough energy to spawn harvester.");
      return ERR_NOT_ENOUGH_ENERGY;
    }

    let result = spawner.spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'harvester', working : false, source: sourceid}});
    if(result !== 'OK')
      console.log(`Failed to spawn harvester: ${result}`);
  }
};

module.exports = roleHarvester;