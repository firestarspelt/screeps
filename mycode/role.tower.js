const profiler = require('screeps-profiler');
const roleTower = {
	/** @param {Tower} tower **/
	run: function(tower) {
		//console.log(tower);
		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (closestHostile) {
			tower.attack(closestHostile);
		} else {
			var closestHurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
			if (closestHurtCreep) {
				tower.heal(closestHurtCreep);
			}
		}
	}
}
profiler.registerObject(roleTower, 'roleTower');
module.exports = roleTower;
