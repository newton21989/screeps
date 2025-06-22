var config = require('config');
var name = require('name');

var roleDistributor = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say('🔄 collect');
    }
    if(!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity(RESOURCE_ENERGY)) {
      creep.memory.working = true;
      creep.say('⏩ move');
    }

    if(creep.memory.working) {
      var target;
      try {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (object) => object.energy < object.energyCapacity && (object.structureType ==   STRUCTURE_SPAWN || object.structureType == STRUCTURE_EXTENSION || object.structureType == STRUCTURE_TOWER)} );
      } catch(e) { console.log("Distributor(" + creep.name + "): Error finding spawns and extensions: " + e); }

      if(!target)
      {
        try {
          target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (object) => object.memory.role != 'harvester' && object.memory.role != 'distributor' && object.memory.refuel });
        } catch(e) { console.log("Distributor(" + creep.name + "):: Error finding creeps: " + e); }
      }
      else if(!target)
      {
        try {
          target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: (object) => object.store[RESOURCE_ENERGY] > object.store.getCapacity(RESOURCE_ENERGY) && object.structureType != STRUCTURE_LINK } );
        } catch(e) { console.log("Distributor(" + creep.name + "):: Error finding everything else except links: " + e); }
      }
      
      if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
    }
    else {
      source = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (object) => object.id != config.link2 && (object.structureType == STRUCTURE_LINK && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0) || (object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY)) } );
      
      if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#00ff00'}});
      }
    }
  },
  
  spawn: function(energy)
  {
    var maxWork = 1;
    var maxCarry = 5;
    var maxMove = 5;
    
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
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'distributor', working : false}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn distributor.");
  }
};

module.exports = roleDistributor;