const roleRepairer = require('role.repairer');
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
			//get room vars
			var constuctByType = creep.room.constuctByType;
			var containers = constuctByType[STRUCTURE_CONTAINER] || [];
			var extensions = constuctByType[STRUCTURE_EXTENSION] || [];

			//if there are containers to build, build them
			if (containers.length) {
				var target = creep.pos.findClosestByRange(containers);
			}
			//otherwise if there are extensions to build, build them
			else if (extensions.length) {
				var target = creep.pos.findClosestByRange(extensions);
			}
			//otherwise build closest construction site
			else {
				var targets = creep.room.constuctSites;
				var target = creep.pos.findClosestByRange(targets);
			}
			//if nothing to build run upgrader code
			if (target == null) {
				roleUpgrader.run(creep);
			}
			//if there is something to build build it, or move to it if not in range
			else if (creep.build(target) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false, range: 3});
			}
		}//if no energy get some
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
