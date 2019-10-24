const profiler = require('screeps-profiler');
const roleUpgrader = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//state change based off energy
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('⚡ upgrade');
		}
		//if working
		if (creep.memory.working) {
			//get controller
			let control = Game.rooms[creep.memory.home].controller;
			//upgrade controller if in range otherwise move to it
			if (creep.upgradeController(control) == ERR_NOT_IN_RANGE) {
				creep.travelTo(control, {range: 3});
			}
		}//if out of energy get some
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleUpgrader, 'roleUpgrader');
module.exports = roleUpgrader;
