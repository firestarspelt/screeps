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
			//if builder has target get it from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if target not valid clear from memory
				if (!target) {
					delete creep.memory.target;
				}
				//get flag from memory
				let flag = Game.flags[creep.memory.flag];
				//build target
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target, {ignoreCreeps: false, range: 3});
				}
				//if flag is set in memory and no target and there is stuff to build in its room move to it
				else if (flag && !target && flag.room.constuctSites.length && flag.room != creep.room) {
					creep.travelTo(flag);
				}
			}//if no target and not in home room move back to homeroom
			else if (!creep.memory.target && creep.memory.home != creep.room.name) {
				creep.travelTo(Game.rooms[creep.memory.home].controller);
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
