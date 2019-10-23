const profiler = require('screeps-profiler');
const roleSupplier = {
/** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		}
		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()/2) {
			creep.memory.working = true;
			creep.say('⚡ supply');
	    }
		var structByType = Game.rooms[creep.room.name].structByType;
		if (creep.memory.working) {
			++creep.memory.timeSinceLastCheck;
			//get target and put in memory if it doesn't exist
			if (!creep.memory.target && creep.memory.timeSinceLastCheck > 10) {
				let targets = (structByType[STRUCTURE_SPAWN] && structByType[STRUCTURE_EXTENSION] && structByType[STRUCTURE_TOWER] && structByType[STRUCTURE_STORAGE]);
				let filteredTargets = _.filter(targets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
				let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
				let spawns = targetsByType[STRUCTURE_SPAWN] || [];
				let extensions = targetsByType[STRUCTURE_EXTENSION] || [];
				let towers = targetsByType[STRUCTURE_TOWER] || [];
				let storage = targetsByType[STRUCTURE_STORAGE] || [];
				if (spawns.length > 0) {
					var target = creep.pos.findClosestByRange(spawns);
				} else if (extensions.length > 0) {
					var target = creep.pos.findClosestByRange(extensions);
				} else if (towers.length > 0) {
					var target = creep.pos.findClosestByRange(towers);
				}
				if (target) {
					creep.memory.target = target.id;
				}
				creep.memory.timeSinceLastCheck = 0;
			}//get target from memory
			else if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if target is full purge from memory
				if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
					delete creep.memory.target;
				}
				//if target is still in memory, and in range tranfser to it, if it isn't move to it
				if (creep.memory.target) {
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target);
					}
				}
			}
		} else {
			var containers = structByType[STRUCTURE_CONTAINER] || [];
			var targets = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, creep.store.getFreeCapacity(RESOURCE_ENERGY)));
			if (targets.length > 0) {
				var target = creep.pos.findClosestByRange(targets);
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target, {ignoreCreeps: false});
				}
			}
		}
	}
}
profiler.registerObject(roleSupplier, 'roleSupplier');
module.exports = roleSupplier;
