const roleUpgrader = require('role.upgrader');
const profiler = require('screeps-profiler');
const roleBuilder = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//state change based off energy
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('🚧 build');
		}
		//if working
		if (creep.memory.working) {
			//get target
			if (!creep.memory.target) {
				creep.getTarget();
			}
			//get target from memory
			let target = Game.getObjectById(creep.memory.target);
			let flag = Game.flags[creep.memory.flag];
			//if nothing to build run upgrader code
			if (!target && !flag) {
				roleUpgrader.run(creep);
			}
			else if (flag.room != creep.room && !target) {
				creep.travelTo(flag);
			}
			else if (creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false});
			}
		}//if no energy get some
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
