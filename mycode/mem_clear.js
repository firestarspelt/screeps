const profiler = require('screeps-profiler');
const mem_clear = {
	run: function () {
		for (let name in Memory.creeps) {
			if (!Game.creeps[name]) {
				let creep = Memory.creeps[name];
				let room = Game.rooms[creep.home];
				switch (creep.role) {
					case "harvester": {
						--room.memory.harvesters;
						if (creep.flag && Game.flags[creep.flag]) {
							--Game.flags[creep.flag].memory.harvesters;
						}
						break;
					}
					case "upgrader": {
						--room.memory.upgraders;
						break;
					}
					case "builder": {
						--room.memory.builders;
						if (creep.flag && Game.flags[creep.flag]) {
							--Game.flags[creep.flag].memory.builders;
						}
						break;
					}
					case "repairer": {
						--room.memory.repairers;
						if (creep.flag && Game.flags[creep.flag]) {
							--Game.flags[creep.flag].memory.repairers;
						}
						break;
					}
					case "supplier": {
						--room.memory.suppliers;
						if (creep.flag && Game.flags[creep.flag]) {
							--Game.flags[creep.flag].memory.suppliers;
						}
						break;
					}
					case "claimer": {
						--room.memory.claimers;
						if (creep.flag && Game.flags[creep.flag]) {
							--Game.flags[creep.flag].memory.claimers;
						}
						break;
					}
				}
				delete Memory.creeps[name];
			}
		}
	}
}
profiler.registerObject(mem_clear, 'mem_clear');
module.exports = mem_clear;
