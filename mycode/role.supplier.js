const profiler = require('screeps-profiler');
const roleSupplier = {
/** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.working && creep.store[RESOURCE_ENERGY] <= creep.store.getCapacity()/5) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		}
		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()/2) {
			creep.memory.working = true;
			creep.say('⚡ supply');
	    }
		if (creep.memory.working) {
			//get target and put in memory if it doesn't exist
			if (!creep.memory.target) {
				creep.getTarget();
			}//get target from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if target is full purge from memory
				if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
					delete creep.memory.target;
					creep.getTarget();
				}//if target is storage dump to it and purge from memory
				if (target.structureType == STRUCTURE_STORAGE) {
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target, {ignoreCreeps: false});
					} else {
						delete creep.memory.target;
					}
				}
				//if target is still in memory, and in range tranfser to it, if it isn't move to it
				if (creep.memory.target) {
					if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target, {ignoreCreeps: false});
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
