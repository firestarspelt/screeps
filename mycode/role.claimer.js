const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		for (let name in Game.flags) {
			let flag = Game.flags[name];
			if (flag.name.includes("Reserve") || flag.name.includes("Claim")) {
				creep.memory.target = flag.name;
				break;
			}
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
