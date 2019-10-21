var roleBuilder = require('role.builder');
module.exports = {
	/** @param {Creep} creep **/
	run: function(creep) {
		// if creep is trying to repair something but has no energy left
		if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
			// if creep is full
		} else if (!creep.memory.working && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
			creep.memory.working = true;
			creep.say('🛠️ repair');
		}
		if (creep.memory.working) {
			var walls = Game.rooms[creep.room.name].walls;
			var infrastructure = Game.rooms[creep.room.name].infrastructure;
			var target;
			for (let percentage = 0.1; percentage <= 1; percentage = percentage + 0.1) {
				for (let structure of infrastructure) {
					if (structure.hits / structure.hitsMax < percentage) {
						target = structure;
						break;
					}
				}
				if (target != undefined) {
					break;
				}
			}
			if (target != undefined) {
				if (creep.repair(target) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target,{ignoreCreeps: false, range: 3});
				}
			} else if (creep.repair(target) == ERR_INVALID_TARGET && creep.room.controller.level > 1) {
				var target;
				var targetHealth = 3000000;
				for (let percentage = 0.01; percentage <= 1; percentage = percentage + 0.01) {
					for (let wall of walls) {
						if (wall.hits / targetHealth < percentage) {
							target = wall;
							break;
						}
					}
					if (target != undefined) {
						break;
					}
				}
				if (target != undefined) {
					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target,{ignoreCreeps: false, range: 3});
					}
				}
			} else {
				roleBuilder.run(creep);
			}
		} else {
			creep.getEnergy();
		}
	}
};
