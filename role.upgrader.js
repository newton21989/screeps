var name = require('name');

var roleUpgrader = {

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
      var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0} );
        
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
  
  spawn: function(energy)
  {
    var maxWork = 5;
    var maxCarry = 7;
    var maxMove = 7;

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
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'upgrader', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn upgrader.");
  }
};

module.exports = roleUpgrader;