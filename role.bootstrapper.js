let name = require('name');
let utils = require('utils');

let roleBootstrapper = {

    /** 
   * @param {Creep} creep 
  **/
  run: function(creep) {
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
      creep.memory.working = true;
      creep.say('⏩ transfer');
    }

    if(creep.memory.working) {
      let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (object) => object.energy < object.energyCapacity && (object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_EXTENSION)} );
      
      if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
      else if(!target)
      {
        target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (object) => object.memory.role != 'harvester' && object.memory.role != 'distributor' && object.memory.refuel });
        
        if(target && creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      else if(!target)
      {
        target = creep.room.controller;
        
        if(creep.upgradeController(target) == ERR_NOT_IN_RANGE)
          creep.moveTo(target, {visualizePathStyle: {stroke: '#0000ff'}});
      }
    }
    else {
      let source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (object) => object.energy > 0 } );
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  
  spawn: function(spawner)
  {
    // let energy = 300 * spawner.room.find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_SPAWN && object.store.getUsedCapacity(RESOURCE_ENERGY) == object.store.getCapacity(RESOURCE_ENERGY)}).length;
    // energy += 50 * spawner.room.find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_EXTENSION && object.store.getUsedCapacity(RESOURCE_ENERGY) == object.store.getCapacity(RESOURCE_ENERGY)}).length;
    let energy = spawner.room.energyAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1 },
        [CARRY]: { min: 1 },
        [MOVE]:  { min: 1 }
    });

    let result = spawner.spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'bootstrapper', working : false}});
    if(result !== 'OK')
      console.log(`Failed to spawn bootstrapper: ${result}`);
  }
};

module.exports = roleBootstrapper;