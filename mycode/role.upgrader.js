const profiler = require('screeps-profiler');
const roleUpgrader = {
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
			let control = creep.memory.home.controller;
			if (creep.upgradeController(control) == ERR_NOT_IN_RANGE) {
				creep.travelTo(control, {range: 3});
			}
		} else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleUpgrader, 'roleUpgrader');
module.exports = roleUpgrader;
