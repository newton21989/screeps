const minUpgraders = 1;
const minBuilders = 1;
const maxFighters = 2;
const minDistributors = 2;
const maxRepairmen = 2;
const maxBootstrappers = 2;

const config = require('config');
const curRoom = Game.rooms[config.curRoom]
let roleHarvester = require('role.harvester');
let roleBuilder = require('role.builder');
let roleUpgrader = require('role.upgrader');
let roleFighter = require('role.fighter');
let roleDistributor = require('role.distributor');
let roleRepairman = require('role.repairman');
let roleBootstrapper = require('role.bootstrapper');
let roleTower = require('role.tower');
let curHarvesters, curUpgraders, curBuilders, curFighters, curDistributors, curRepairmen, curBootstrappers, energy;

module.exports.loop = function () {

  let spawner = Game.spawns[Object.keys(Game.spawns)[0]];
  let sources = spawner.room.find(FIND_SOURCES);

  curHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');      // Harvesters are optimized for collecting energy from nodes
  let curHarvester1 = _.sum(Game.creeps, (c) => c.memory.source == sources[0].id);  // Harvester 1 is dedicated to 1 node
  let curHarvester2 = _.sum(Game.creeps, (c) => c.memory.source == sources[1].id);  // Harvester 2 is dedicated to the other
  curUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  curBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  curRepairmen = _.sum(Game.creeps, (c) => c.memory.role == 'repairman');
  curFighters = _.sum(Game.creeps, (c) => c.memory.role == 'fighter');
  curDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor');
  curBootstrappers = _.sum(Game.creeps, (c) => c.memory.role == 'bootstrapper');
  let numConstructionSites = spawner.room.find(FIND_CONSTRUCTION_SITES).length
  let numHostiles = spawner.room.find(FIND_HOSTILE_CREEPS).length
  
  let towers = curRoom.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_TOWER});
  
  // energy = 300 + 50 * curRoom.find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_EXTENSION}).length;
   energy = spawner.room.energyAvailable;
  
  /* Bootstrappers only have basic stats, just enough to start harvesting 
  // energy so we can spawn specialized creeps.
  // If we have not exceeded maxBootstrappers and (
  // There are no harvesters,
  // distributors, or containers), then spawn a(nother) bootstrapper */
  if(maxBootstrappers > curBootstrappers && (
      curHarvesters == 0 ||
      curDistributors == 0 ||
      spawner.room.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_CONTAINER } ).length == 0
      )
    ) {
    roleBootstrapper.spawn(spawner);
  }
  // If harvester1 doesn't exist, spawn him
  else if (!curHarvester1) {
    roleHarvester.spawn(spawner, sources[0].id);
  }
  // If we have not exceeded maxDistributors and there are containers, spawn distributors
  else if (curDistributors < minDistributors &&
    curRoom.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_CONTAINER } ).length > 0) {
    roleDistributor.spawn(spawner);
  }
  // If there is a second energy node and no harvester, spawn one
  else if (sources.length > 1 && !curHarvester2) {
    roleHarvester.spawn(spawner, sources[1].id);
  }
  else if (curUpgraders < minUpgraders) {
    roleUpgrader.spawn(spawner);
  }
  // If we've fallen below minBuilders and there are construction sites
  else if (curBuilders < minBuilders && numConstructionSites > 0) {
    roleBuilder.spawn(spawner);
  }
  // If we've not exceeded maxRepairmen and there are damaged structures, spawn repairmen
  else if (curRepairmen < maxRepairmen && 
    curRoom.find(FIND_STRUCTURES, {filter: (object) => object.hits < 0.8 * object.hitsMax}).length > 0) {
    roleRepairman.spawn(spawner);
  }
  else if (curFighters < maxFighters && numHostiles > 0) {
    roleFighter.spawn(spawner);
  }

  let link1 = Game.getObjectById(config.link1); // TODO: is there a way to get link id's dynamically?
  let link2 = Game.getObjectById(config.link2);

  if(link1 != null && link2 != null)
  {
    if(link1.energy < link1.energyCapacity && link2.energy >= 250) {
      link2.transferEnergy(link1);
    }
  }

  for(let name in Game.creeps) {
    let creep = Game.creeps[name];
    
    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if(creep.memory.role == 'repairman') {
      roleRepairman.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'fighter') {
      roleFighter.run(creep);
    }
    if(creep.memory.role == 'distributor') {
      roleDistributor.run(creep);
    }
    if(creep.memory.role == 'bootstrapper') {
      roleBootstrapper.run(creep);
    }
  }
  
  for(let tower of towers)
  {
    roleTower.run(tower);
  }
}