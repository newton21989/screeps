var name = require('name');

var roleFighter = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.refuel == false && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      creep.memory.refuel = true;
      creep.say('🔄 refuel');
    }
    if(creep.memory.refuel == true && creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity) {
      creep.memory.refuel = false;
      creep.say('⚔️ fight');
    }

    if(creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS))
      creep.memory.working = true;
    else
      creep.memory.working = false;

    if(creep.memory.working) {
      var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(creep.attack(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        else if(creep.attack(target) == ERR_INVALID_TARGET)
        {
          creep.say("Target eliminated.");
          creep.memory.working = false;
        }
        else
        {
          creep.say(creep.attack(target));
        }
    }
    /*else {
      if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
      {
        var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_CONTAINER && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0} );
          if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }
    }*/
  },

  spawn: function(energy)
  {
    var maxWork = 1;
    var maxCarry = 1;
    var maxMove = 5;
    var maxAttack = 5;

    var costWork = 100 * maxWork;
    var costCarry = 50 * maxCarry;
    var costMove = 50 * maxMove;
    var costAttack = 80 * maxAttack;

    var maxParts = costWork + costCarry + costMove + costAttack;
    var weightWork = costWork / maxParts;
    var weightCarry = costCarry / maxParts;
    var weightMove = costMove / maxParts;
    var weightAttack = costAttack / maxParts;

    var spawnWork = Math.floor(energy * weightWork / 100)
    var spawnCarry = Math.floor(energy * weightCarry / 50)
    var spawnMove = Math.floor(energy * weightMove / 50)
    var spawnAttack = Math.floor(energy * weightAttack / 80)

    var spawnParts = Array();

    for(var i = 0; i < Math.max(spawnWork, 1); i++)
      spawnParts.push(WORK);

    for(var i = 0; i < Math.max(spawnCarry, 1); i++)
      spawnParts.push(CARRY);

    for(var i = 0; i < Math.max(spawnMove, 1); i++)
      spawnParts.push(MOVE);

    for(var i = 0; i < Math.max(spawnAttack, 1); i++)
      spawnParts.push(ATTACK);

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'fighter', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn upgrader.");
  }

};

module.exports = roleFighter;