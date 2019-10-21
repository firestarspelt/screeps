module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('⚡ upgrade');
		}
		if (creep.memory.working) {
			var control = creep.room.controller;
			if (creep.upgradeController(control) == ERR_NOT_IN_RANGE) {
				creep.travelTo(control, {range: 3});
			}
		} else {
			getEnergy(creep);
		}
	}
};
