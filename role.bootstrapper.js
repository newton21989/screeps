var name = require('name');

var roleBootstrapper = {

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
      var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (object) => object.energy < object.energyCapacity && (object.structureType == STRUCTURE_SPAWN || object.structureType == STRUCTURE_EXTENSION)} );
      
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
      var source = creep.pos.findClosestByPath(FIND_SOURCES, { filter: (object) => object.energy > 0 } );
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },
  
  spawn: function(spawn)
  {
    energy = 300 * Game.spawns[spawn].room.find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_SPAWN && object.store.getUsedCapacity(RESOURCE_ENERGY) == object.store.getCapacity(RESOURCE_ENERGY)}).length;
    energy += 50 * Game.spawns[spawn].room.find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_EXTENSION && object.store.getUsedCapacity(RESOURCE_ENERGY) == object.store.getCapacity(RESOURCE_ENERGY)}).length;

    var maxWork = 5;
    var maxCarry = 1;
    var maxMove = 3;

    var costWork = 100 * maxWork;
    var costCarry = 50 * maxCarry;
    var costMove = 50 * maxMove;

    var maxParts = costWork + costCarry + costMove;
    var weightWork = costWork / maxParts;
    var weightCarry = costCarry / maxParts;
    var weightMove = costMove / maxParts;

    var spawnWork = Math.floor(energy * weightWork / 100)
    var spawnCarry = Math.floor(energy * weightCarry / 50)
    var spawnMove = Math.floor(energy * weightMove / 50)

    var spawnParts = Array();

    for(var i = 0; i < Math.max(Math.min(spawnWork, maxWork), 1); i++)
      spawnParts.push(WORK);

    for(var i = 0; i < Math.max(Math.min(spawnCarry, maxCarry), 1); i++)
      spawnParts.push(CARRY);

    for(var i = 0; i < Math.max(Math.min(spawnMove, maxMove), 1); i++)
      spawnParts.push(MOVE);

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'bootstrapper', working : false}});
    //console.log(spawn);
  }
};

module.exports = roleBootstrapper;