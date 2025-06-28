let name = require('name');
let utils = require('utils');

let roleFighter = {

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

  spawn: function(spawner)
  {
    let energy = spawner.room.energyAvailable;

    let spawnParts = utils.generateBody(energy, {
        [WORK]:  { min: 1 },
        [CARRY]: { min: 1 },
        [MOVE]:  { min: 1, max: 5 },
        [ATTACK]:  { min: 1, max: 5 }
    });

    //console.log(spawnParts);
    spawn = Game.spawns['Spawn1'].spawnCreep(spawnParts, name.getRandom(), { memory: { role: 'fighter', working : false, refuel: true}});
    //if(spawn == ERR_NOT_ENOUGH_ENERGY)
    //  console.log("Not enough energy to spawn upgrader.");
  }

};

module.exports = roleFighter;