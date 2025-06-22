var minUpgraders = 1;
var minBuilders = 1;
var maxFighters = 2;
var minDistributors = 2;
var maxRepairmen = 2;
var maxBootstrappers = 2;

var config = require('config');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleFighter = require('role.fighter');
var roleDistributor = require('role.distributor');
var roleRepairman = require('role.repairman');
var roleBootstrapper = require('role.bootstrapper');
var roleTower = require('role.tower');
var curHarvesters, curUpgraders, curBuilders, curFighters, curDistributors, curRepairmen, curBootstrappers, energy;

module.exports.loop = function () {

  var sources = Game.rooms[config.curRoom].find(FIND_SOURCES);

  curHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');      // Harvesters are optimized for collecting energy from nodes
  curHarvester1 = _.sum(Game.creeps, (c) => c.memory.source == sources[0].id);  // Harvester 1 is dedicated to 1 node
  curHarvester2 = _.sum(Game.creeps, (c) => c.memory.source == sources[1].id);  // Harvester 2 is dedicated to the other
  curUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
  curBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
  curRepairmen = _.sum(Game.creeps, (c) => c.memory.role == 'repairman');
  curFighters = _.sum(Game.creeps, (c) => c.memory.role == 'fighter');
  curDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor');
  curBootstrappers = _.sum(Game.creeps, (c) => c.memory.role == 'bootstrapper');
  numConstructionSites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES).length
  numHostiles = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS).length
  
  var towers = Game.rooms[config.curRoom].find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_TOWER});
  
  energy = 300 + 50 * Game.rooms[config.curRoom].find(FIND_MY_STRUCTURES, {filter: (object) => object.structureType == STRUCTURE_EXTENSION}).length;

  
  /* Bootstrappers only have basic stats, just enough to start harvesting 
  // energy so we can spawn specialized creeps.
  // If we have not exceeded maxBootstrappers and (
  // There are no harvesters,
  // distributors, or containers), then spawn a(nother) bootstrapper */
  if(maxBootstrappers > curBootstrappers && (
      curHarvesters == 0 ||
      curDistributors == 0 ||
      Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_CONTAINER } ).length == 0
      )
    ) {
    roleBootstrapper.spawn('Spawn1');
  }
  // If harvester1 doesn't exist, spawn him
  else if (!curHarvester1) {  
    roleHarvester.spawn(energy, sources[0].id);
  }
  // If we have not exceeded maxDistributors and there are containers, spawn distributors
  else if (curDistributors < minDistributors &&
    Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, { filter: (object) => object.structureType == STRUCTURE_CONTAINER } ).length > 0) {
    roleDistributor.spawn(energy);
  }
  // If there is a second energy node and no harvester, spawn one
  else if (sources.length > 1 && !curHarvester2) {
    roleHarvester.spawn(energy, sources[1].id);
  }
  else if (curUpgraders < minUpgraders) {
    roleUpgrader.spawn(energy);
  }
  // If we've fallen below minBuilders and there are construction sites
  else if (curBuilders < minBuilders && numConstructionSites > 0) {
    roleBuilder.spawn(energy);
  }
  // If we've not exceeded maxRepairmen and there are damaged structures, spawn repairmen
  else if (curRepairmen < maxRepairmen && 
    Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {filter: (object) => object.hits < 0.8 * object.hitsMax}).length > 0) {
    roleRepairman.spawn(energy);
  }
  else if (curFighters < maxFighters && numHostiles > 0) {
    roleFighter.spawn(energy);
  }

  var link1 = Game.getObjectById(config.link1); // TODO: is there a way to get link id's dynamically?
  var link2 = Game.getObjectById(config.link2);

  if(link1 != null && link2 != null)
  {
    if(link1.energy < link1.energyCapacity && link2.energy >= 250) {
      link2.transferEnergy(link1);
    }
  }

  for(let name in Game.creeps) {
    var creep = Game.creeps[name];
    
    if(creep.pos.isEqualTo(23,24))
      creep.move(BOTTOM);
    
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