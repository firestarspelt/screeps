const roleUpgrader = require('role.upgrader');
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
			try {
				let structures = creep.room.lookForAtArea(LOOK_STRUCTURES,creep.pos.y - 3,creep.pos.x - 3,creep.pos.y + 3,creep.pos.x + 3, true);
				let structure = _.min(structures, 'hits');
				if (structure.hits < structure.hitsMax - creep.memory.workParts * 100) {
					creep.repair(structure);
				}
			} catch (err) {
				console.log(creep.name + " Caused " + (err.stack || err));
			}
			//get target if it doesn't have one
			if (!creep.memory.target) {
				creep.getTarget();
			}
			//if repairer has target get from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if target not valid clear from memory
				if (!target) {
					delete creep.memory.target;
					delete creep.memory.targetOldHits;
				}
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
			}//if no target and not in home room move back to homeroom
			else if (!creep.memory.target && creep.memory.home != creep.room.name) {
				creep.travelTo(Game.rooms[creep.memory.home]);
			}//If nothing to repair run upgrader code
			else {
				roleUpgrader.run(creep);
			}
		}//if not working get energy
		else {
			creep.getEnergy();
		}
	}
}
profiler.registerObject(roleRepairer, 'roleRepairer');
module.exports = roleRepairer;
