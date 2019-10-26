const profiler = require('screeps-profiler');
const roleClaimer = {
	run: function (creep) {
		for (let name in Game.flags) {
			let flag = Game.flags[name];
			if (flag.name.includes("Reserve") || flag.name.includes("Claim")) {
				creep.memory.target = flag.id;
				break;
			}
		}
		let target = Game.getObjectById(creep.memory.target);
		console.log(target);
		creep.travelTo(target);
		if (target.name.includes("Reserve")) {
			creep.reserveController(target);
		} else if (target.name.includes("Claim")) {
			creep.claimController(target);
		}
	}
}
profiler.registerObject(roleClaimer, 'roleClaimer');
module.exports = roleClaimer;
