var config = require('config');
var name = require('name');

mostDamaged = function( array ){
  var array2 = Array();
  
  for(let object of array) {
    array2.push(object.hits / object.hitsMax);
  }
  
  return array[array2.indexOf(Math.min.apply(Math, array2))];
}

var roleTower = {
  run: function(tower)
  {
    var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(target)
      tower.attack(target);
    else
    {
      var targets = Game.rooms[config.curRoom].find(FIND_STRUCTURES, {filter: (object) => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART })
      
      if(targets.length < 1)
        targets = Game.rooms[config.curRoom].find(FIND_STRUCTURES, {filter: (object) => object.hits < object.hitsMax && object.structureType == STRUCTURE_RAMPART })
      
      if(targets.length < 1)
        targets = Game.rooms[config.curRoom].find(FIND_STRUCTURES, {filter: (object) => object.hits < object.hitsMax && object.structureType == STRUCTURE_WALL })
      
      target = mostDamaged(targets);
      if(target)
        tower.repair(target);
      /*else
      {
        target = tower.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(target)
          tower.build(target);
      }*/
    }

  }
}
module.exports = roleTower;