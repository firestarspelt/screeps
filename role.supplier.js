var roleSupplier = {
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
		if (creep.memory.working) {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (s) => {
					return ((s.structureType == STRUCTURE_SPAWN ||
					s.structureType == STRUCTURE_EXTENSION ||
					s.structureType == STRUCTURE_TOWER ||
					s.structureType == STRUCTURE_STORAGE) &&
					s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY))
				}
			});
			var target = creep.pos.findClosestByPath(targets);
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false});
			}
		} else {
			var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (s) => {
					return (s.structureType == STRUCTURE_CONTAINER &&
					s.store[RESOURCE_ENERGY] >= (200 || creep.store.getCapacity() - creep.store[RESOURCE_ENERGY]))
				}
			});
			if (targets.length > 0) {
				var target = creep.pos.findClosestByPath(targets);
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target, {ignoreCreeps: false});
				}
			}
		}
	}
}

module.exports = roleSupplier;
