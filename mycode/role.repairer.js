const roleBuilder = require("role.builder");
const profiler = require('screeps-profiler');
const roleRepairer = {
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
		//if creep is working
		if (creep.memory.working) {
			//repair damaged structures on its path
			let target = creep.room.lookForAt(LOOK_STRUCTURES, creep);
			//if it won't over repair target repair it
			if (target.hits < target.hitsMax - creep.memory.workParts * 100) {
				creep.repair(target);
			}
			//get room vars
			let walls = Game.rooms[creep.room.name].walls;
			let infrastructure = Game.rooms[creep.room.name].infrastructure;
			//if repairer doesn't have a target, find some infrastructure to repair
			if (!creep.memory.target && infrastructure.length > 0) {
				creep.memory.target = infrastructure[0].id;
				creep.memory.targetOldHits = infrastructure[0].hits;
			}
			//if repairer still doesn't have a target and walls are repairable, find a wall to repair
			if (!creep.memory.target && creep.room.controller.level > 1 && walls.length > 0) {
				creep.memory.target = walls[0].id;
				creep.memory.targetOldHits =  walls[0].hits;
			}
			//if repairer has target retrieve from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if repairer's target would be over repaired or has been repaired over 50000 hits purge from memory
				if ((target.hits / (target.hitsMax - creep.memory.workParts * 100) >= 1) || (target.hits - creep.memory.targetOldHits) > 50000) {
					delete creep.memory.target;
					delete creep.memory.targetOldHits;
				}
				//if target is still in memory, and in range repair it, if it isn't move into range of it
				if (creep.memory.target) {
					if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.travelTo(target,{ignoreCreeps: false, range: 3});
					}
				}
			}//If nothing to repair run builder code
			else {
				roleBuilder.run(creep);
			}
		}//if not working get energy
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleRepairer, 'roleRepairer');
module.exports = roleRepairer;
