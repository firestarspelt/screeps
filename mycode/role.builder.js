const roleRepairer = require('role.repairer');
const profiler = require('screeps-profiler');
const roleBuilder = {
	/** @param {Creep} creep **/
	run: function(creep) {
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('🚧 build');
		}
		if (creep.memory.working) {
			var constuctByType = Game.rooms[creep.room.name].constuctByType;
			var containers = constuctByType[STRUCTURE_CONTAINER] || [];
			var extensions = constuctByType[STRUCTURE_EXTENSION] || [];
			if (containers.length > 0) {
				var target = creep.pos.findClosestByRange(containers);
			} else if (extensions.length > 0) {
				var target = creep.pos.findClosestByRange(extensions);
			} else {
				var targets = Game.rooms[creep.room.name].constuctSites;
				var target = creep.pos.findClosestByRange(targets);
			}
			if (target == null) {
				roleRepairer.run(creep);
			} else if (creep.pos.inRangeTo(target,3)) {
				creep.build(target);
			} else {
				creep.travelTo(target, {ignoreCreeps: false, range: 3});
			}
		} else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleBuilder, 'roleBuilder');
module.exports = roleBuilder;
