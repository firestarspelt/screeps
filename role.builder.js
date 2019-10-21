var roleUpgrader = require('role.upgrader');
module.exports = {
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
			var containers = constuctByType[STRUCTURE_CONTAINER];
			var extensions = constuctByType[STRUCTURE_EXTENSION];
			var roads = constuctByType[STRUCTURE_ROAD];
			var targets = containers.concat(roads);
			var target = targets[0];
			if (target == null) {
				roleUpgrader.run(creep);
			} else if (creep.pos.inRangeTo(target,3)) {
				creep.build(target);
			} else {
				creep.travelTo(target, {ignoreCreeps: false, range: 3});
			}
		} else {
			creep.getEnergy();
		}
	}
};
