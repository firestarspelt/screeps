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
			var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			var target = creep.pos.findClosestByRange(targets);
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