const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.target];
		creep.travelTo(flag);
		if (flag.name.includes("Reserve")) {
			creep.reserveController(creep.room.controller);
		} else if (flag.name.includes("Claim")) {
			creep.claimController(creep.room.controller);
		}
	}
}
profiler.registerObject(roleClaimer, 'roleClaimer');
module.exports = roleClaimer;
