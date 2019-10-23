const profiler = require('screeps-profiler');
const roleHarvester = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.store.getCapacity() > 0 ) {
			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = true;
				creep.say('mine');
			} else if (!creep.memory.working && creep.store.getFreeCapacity(RESOURCE_ENERGY) - creep.memory.workParts * 2 > 0) {
				creep.memory.working = false;
				creep.say('dump');
			}
			if (creep.store.getFreeCapacity(RESOURCE_ENERGY) - creep.memory.workParts * 2 > 0) {
				creep.mine();
			} else if (creep.store[RESOURCE_ENERGY] > 0) {
				var structByType = Game.rooms[creep.room.name].structByType;
				var containers = structByType[STRUCTURE_CONTAINER] || [];
				var spawns = structByType[STRUCTURE_SPAWN] || [];
				var targets = containers.concat(spawns);
				if (targets.length > 0) {
					var target = creep.pos.findClosestByRange(targets, {filter: (s) => s.store.getFreeCapacity(RESOURCE_ENERGY) > 0});
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target);
					}
				}
			}
		} else {
			creep.mine();
		}
	}
}
profiler.registerObject(roleHarvester, 'roleHarvester');
module.exports = roleHarvester;
