var name = require('name');

var roleRepairman = {

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
      var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0} );

      if(source && creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  },

  spawn: function(energy)
  {
    var maxWork = 4;
    var maxCarry = 3;
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
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'repairman', working : false}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn repairman.");
  }
};

module.exports = roleRepairman;