const profiler = require('screeps-profiler');
const roleLongRangeSupplier = {
	run: function (creep) {
		if (!creep.memory.target) {
			creep.getTarget();
		}
		let flag = Game.flags[creep.memory.flag];
		creep.travelTo(flag);
		if (global.harvestFlags.includes(flag)) {

		}
	}
}
profiler.registerObject(roleLongRangeSupplier, 'roleLongRangeSupplier');
module.exports = roleLongRangeSupplier;
