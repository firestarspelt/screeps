const profiler = require('screeps-profiler');
const roleSupplier = {
/** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		}
		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('⚡ supply');
	    }
		let structByType = Game.rooms[creep.room.name].structByType;
		if (creep.memory.working) {
			//get target and put in memory if it doesn't exist
			if (!creep.memory.target) {
				let spawns = structByType[STRUCTURE_SPAWN] || [];
				let extensions = structByType[STRUCTURE_EXTENSION] || [];
				let towers = structByType[STRUCTURE_TOWER] || [];
				let supplyTargets = (spawns.concat(extensions).concat(towers));
				let filteredTargets = _.filter(supplyTargets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
				let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
				let targetSpawns = creep.pos.findInRange(targetsByType[STRUCTURE_SPAWN], 25);
				let targetExtensions = creep.pos.findInRange(targetsByType[STRUCTURE_EXTENSION], 20);
				let targetTowers = targetsByType[STRUCTURE_TOWER] || [];
				if (targetSpawns.length || targetExtensions.length) {
					let target = creep.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
					creep.memory.target = target.id;
				} else if (targetTowers.length) {
					let target = creep.pos.findClosestByRange(targetTowers);
					creep.memory.target = target.id;
				} else if (creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					let target = creep.room.storage;
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
		}
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleSupplier, 'roleSupplier');
module.exports = roleSupplier;
