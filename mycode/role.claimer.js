const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.target];
		creep.travelTo(flag);
		switch (flag.memory.type) {
			case "reserve":
				creep.reserveController(creep.room.controller);
				break;
			case "claim":
				creep.claimController(creep.room.controller);
				break;
		}
	}
}
profiler.registerObject(roleClaimer, 'roleClaimer');
module.exports = roleClaimer;
