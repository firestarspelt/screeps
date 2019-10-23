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
	let targetList = [];
	//set intitial percentage to increment value, and keep incrementing while percentage is less than 1
	for (let percentage = increment; percentage <= 1; percentage = percentage + increment) {
		//interate through targets
		for (let target of targets) {
			//if targets hits / targetHealth is less than current percentage add to targetList
			if (target.hits / (target.hitsMax - creep.memory.workParts * 100) < percentage) {
				targetList.push(target);
			}
		}
		//if targetList isn't empty, set closest one to target and break from loop
		if (targetList.length > 0) {
			let target = creep.pos.findClosestByPath(targetList);
			//set target
			creep.memory.target = target.id;
			creep.memory.targetOldHits = target.hits;
			//break from loop
			break;
		}
	}
}
getTarget = profiler.registerFN(getTarget, 'roleRepairer.getTarget');
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
			//repair damaged structures within its path
			try {
				let structures = creep.room.lookForAtArea(LOOK_STRUCTURES,creep.pos.y - 1,creep.pos.x - 1,creep.pos.y + 1,creep.pos.x + 1, true);
				for (let structure of structures) {
					let target = structure['structure'];
					//if it won't over repair target repair it
					if (target.hits < target.hitsMax - creep.memory.workParts * 100) {
						creep.repair(target);
						break;
					}
				}
			} catch (err) {
				console.log(creep.name + " Caused " + err);
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
				creep.memory.target = walls[0].id;
				creep.memory.targetOldHits =  walls[0].hits;
			}
			//if repairer has target retrieve from memory
			if (creep.memory.target) {
				let target = Game.getObjectById(creep.memory.target);
				//if repairer's target would be over repaired or has been repaired over 30000 hits purge from memory
				if ((target.hits / (target.hitsMax - creep.memory.workParts * 100) >= 1) || (target.hits - creep.memory.targetOldHits) > 30000) {
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
