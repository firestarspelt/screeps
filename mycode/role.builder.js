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
			if (!target) {
				delete creep.memory.target;
			}
			let flag = Game.flags[creep.memory.flag];
			if (flag && !target && flag.room.constuctSites.length && flag.room != creep.room) {
				creep.travelTo(flag);
			}
			else if (creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false, range: 3});
			}
			else if (!target && creep.memory.home != creep.room.name) {
				creep.travelTo(Game.rooms[creep.memory.home]);
			}//if nothing to build run upgrader code
			else {
				roleUpgrader.run(creep);
			}
		}//if no energy get some
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
