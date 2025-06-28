let name = require('name');
let utils = require('utils');

let roleBuilder = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.refuel == false && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.refuel = true;
      creep.say('🔄 refuel');
    }
    if(creep.memory.refuel == true && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity(RESOURCE_ENERGY)) {
      creep.memory.refuel = false;
      creep.say('🚧 build');
    }
    
    if(creep.memory.refuel)
    {
      var target = creep.pos.findClosestByPath(FIND_SOURCES);
    }
    else
    {
      var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (site) => site.structureType == STRUCTURE_CONTAINER || site.structureType == STRUCTURE_EXTENSION});
        if(!target)
          target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    }

    if(creep.memory.working == false && target)
      creep.memory.working = true;
    if(creep.memory.working == true && !target)
      creep.memory.working = false;

    let numContainers = creep.room.find(FIND_STRUCTURES, {filter: (struct) => struct.structureType == STRUCTURE_CONTAINER}).length;

    if(creep.memory.working) {
      if(target && creep.build(target) == ERR_NOT_IN_RANGE)
      {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else if(numContainers == 0) {
      let source = creep.pos.findClosestByPath(FIND_SOURCES);
        
      if(source && creep.harvest(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      else if(!source)
      {
        source = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (object) => object.memory.transferring});
        if(source)
          creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  
  spawn: function(spawner)
  {
    let energy = spawner.room.energyAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1, max: 5 },
        [CARRY]: { min: 1, max: 7 },
        [MOVE]:  { min: 1, max: 7 }
    });

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'builder', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn builder.");

  }
};

module.exports = roleBuilder;