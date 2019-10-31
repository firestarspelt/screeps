const profiler = require('screeps-profiler');
const roleRanger = {
	run: function(creep) {
		let attack = global.attackFlags;
		for (let flag of attack) {
			creep.memory.flag = flag.name;
			break flagTarget;
		}
		let flag = Game.flags[creep.memory.flag];
		creep.travelTo(flag);
		let targets = creep.room.enemyCreeps;
		if (creep.memory.target) {
			let target = Game.getObjectById(creep.memory.target);
			if (!target) {
				delete creep.memory.target;
			}
		}
		if (!creep.memory.target) {
			getTarget: {
				for (let target of targets) {
					if (target.getActiveBodyparts(RANGED_ATTACK) > 0) {
						creep.memory.target = target.id;
						break getTarget;
					}
				}
				for (let target of targets) {
					if (target.getActiveBodyparts(RANGED_ATTACK) > 0) {
						creep.memory.target = target.id;
						break getTarget;
					}
				}
			}
		}
		let target = creep.pos.findClosestByRange(targets);
		creep.rangedAttack(target);
		target = Game.getObjectById(creep.memory.target);
		if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
			creep.travelTo(target, {ignoreCreeps: false, range: 3, ignoreRoads: true, movingTarget: true});
		}
		if (creep.pos.getRangeTo(target) < 3) {
			let path = PathFinder.search(creep.pos, targets.map(c=>{return{pos:c.pos,range:2}},{flee:true}).path;
			creep.moveByPath(path);
		}
	}
}
profiler.registerObject(roleRanger, 'roleRanger');
module.exports = roleRanger;
