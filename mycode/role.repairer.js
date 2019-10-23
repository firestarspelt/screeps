const roleBuilder = require("role.builder");
const profiler = require('screeps-profiler');
/**
 * This function gets a low health target and sets the target and targetHealth if it isn't set
 * targetHealth is only ever set for walls or ramparts
 * @param  {object <Creep>} creep the creep getting a target
 * @param  {number} increment the value to increment by
 * @param  {array <object <Structure>>} targets an array of target structures
 */
function getTarget(creep, increment, targets) {
	//set intitial percentage to increment value, and keep incrementing while percentage is less than 1
	for (let percentage = increment; percentage <= 1; percentage = percentage + increment) {
		//interate through targets
		for (let target of targets) {
			//set targetHealth to memory value if it exists, otherwise set it to hitsMax of target
			if (creep.memory.targetHealth) {
				var targetHealth = creep.memory.targetHealth;
			} else {
				var targetHealth = target.hitsMax;
			}
			//if targets hits / targetHealth is less than current percentage set to target
			if (target.hits / (targetHealth - creep.memory.workParts * 100) < percentage) {
				//set targetHealth to memory if it wasn't, otherwise set it to itself multiplied by the percentage
				if (!creep.memory.targetHealth) {
					creep.memory.targetHealth = targetHealth;
				} else {
					creep.memory.targetHealth = creep.memory.targetHealth * percentage;
				}
				//set target to memory
				creep.memory.target = target.id;
				//break from loop
				break;
			}
		}
		//if target found break from loop
		if (creep.memory.target) {
			break;
		}
	}
}
getTarget = profiler.registerFN(getTarget);
const roleRepairer = {
	/** @param {Creep} creep **/
	run: function(creep) {
		//state change based off carried energy
		switch (creep.store[RESOURCE_ENERGY]) {
			case creep.store.getCapacity():
				creep.memory.working = true;
				creep.say('🛠️ repair');
				break;
			case 0:
				creep.memory.working = false;
				creep.say('🔄 refill');
		}
		//if creep is working
		if (creep.memory.working) {
			//repair damaged structures within its path
			let structures = creep.room.lookForAtArea(LOOK_STRUCTURES,creep.pos.y - 2,creep.pos.x - 2,creep.pos.y + 2,creep.pos.x + 2, true);
			for (let structure of structures) {
				let target = structure['structure'];
				//if it won't over repair target repair it
				if (target.hits < target.hitsMax - creep.memory.workParts * 100) {
					creep.repair(target);
					break;
				}
			}
			//get room vars
			let walls = Game.rooms[creep.room.name].walls;
			let infrastructure = Game.rooms[creep.room.name].infrastructure;
			//if repairer doesn't have a target, find some infrastructure to repair
			if (!creep.memory.target) {
				getTarget(creep, 0.1, infrastructure);
			}
			//if repairer still doesn't have a target and walls are repairable, find a wall to repair
			if (!creep.memory.target && creep.room.controller.level > 1) {
				//set targetHealth for walls and ramparts
				creep.memory.targetHealth = 3000000;
				getTarget(creep, 0.01, walls);
			}
			//if repairer has target retrieve from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if repairer's target would be over repaired purge from memory
				if (target.hits / (creep.memory.targetHealth - creep.memory.workParts * 100) >= 1) {
					delete creep.memory.target;
					delete creep.memory.targetHealth;
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
