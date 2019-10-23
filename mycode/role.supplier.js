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
			//get target and put in memory if it doesn't exist
			if (!creep.memory.target) {
				let spawns = structByType[STRUCTURE_SPAWN] || [];
				let extensions = structByType[STRUCTURE_EXTENSION] || [];
				let towers = structByType[STRUCTURE_TOWER] || [];
				let targets = (spawns.concat(extensions).concat(towers));
				let filteredTargets = _.filter(targets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
				let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
				let targetSpawns = creep.pos.findInRange(targetsByType[STRUCTURE_SPAWN], 15);
				let targetExtensions = creep.pos.findInRange(targetsByType[STRUCTURE_EXTENSION], 10);
				let targetTowers = targetsByType[STRUCTURE_TOWER] || [];
				if (targetSpawns.length > 0 || targetExtensions.length > 0) {
					var target = creep.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
				} else if (targetTowers.length > 0) {
					var target = creep.pos.findClosestByRange(targetTowers);
				} else if (creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					var target = creep.room.storage;
				}
				if (target) {
					creep.memory.target = target.id;
				}
			}//get target from memory
			else if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if target is full purge from memory
				if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
					delete creep.memory.target;
				}//if target is storage dump to it and purge from memory
				else if (target.structureType == STRUCTURE_STORAGE) {
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target);
					} else {
						delete creep.memory.target;
					}
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
