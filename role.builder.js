var name = require('name');

var roleBuilder = {

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

    var numContainers = creep.room.find(FIND_STRUCTURES, {filter: (struct) => struct.structureType == STRUCTURE_CONTAINER}).length;

    if(creep.memory.working) {
      if(target && creep.build(target) == ERR_NOT_IN_RANGE)
      {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
    else if(numContainers == 0) {
      var source = creep.pos.findClosestByPath(FIND_SOURCES);
        
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
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'builder', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn builder.");

  }
};

module.exports = roleBuilder;