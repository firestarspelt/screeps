/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.tower');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
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
};