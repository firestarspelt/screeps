const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.flag];
		creep.travelTo(flag);
		if (global.reserveFlags.includes(flag)) {
			if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.travelTo(creep.room.controller);
			}
		}
		else if (global.claimFlags.includes(flag)) {
			if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.travelTo(creep.room.controller);
			}
		}
	}
}
profiler.registerObject(roleClaimer, 'roleClaimer');
module.exports = roleClaimer;
