const profiler = require('screeps-profiler');
const roleTower = {
	/** @param {Tower} tower **/
	run: function(tower) {
		//console.log(tower);
		var closestHostile = tower.pos.findClosestByRange(Game.rooms[tower.room.name].enemyCreeps);
		if (closestHostile) {
			tower.attack(closestHostile);
		} else {
			var closestHurtCreep = tower.pos.findClosestByRange(Game.rooms[tower.room.name].myCreeps, {filter: (c) => c.hits < c.hitsMax});
			if (closestHurtCreep) {
				tower.heal(closestHurtCreep);
			}
		}
	}
}
profiler.registerObject(roleTower, 'roleTower');
module.exports = roleTower;
