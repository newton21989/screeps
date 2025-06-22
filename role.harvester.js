var name = require('name');

var roleHarvester = {

  /** @param {Creep} creep **/
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
      var target = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (object) => (object.structureType == STRUCTURE_CONTAINER && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0) || (object.structureType == STRUCTURE_LINK && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0) } )
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
      var source = Game.getObjectById(creep.memory.source);
      if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  },

  spawn: function(energy, sourceid)
  {
    var maxWork = 6;
    var maxCarry = 1;
    var maxMove = 1;

    var costWork = 105 * maxWork;
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

    // console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'harvester', working : false, source: sourceid}});
    // if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //   console.log("Not enough energy to spawn harvester.");
  }
};

module.exports = roleHarvester;