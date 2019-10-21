module.exports = {
/** @param {Creep} creep **/
    run: function(creep) {
	    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.working = false;
			creep.say('🔄 refill');
		}
		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()/2) {
			creep.memory.working = true;
			creep.say('⚡ supply');
	    }
		var structByType = Game.rooms[creep.room.name].structByType;
		if (creep.memory.working) {
			var spawns = structByType[STRUCTURE_SPAWN] || [];
			var extensions = structByType[STRUCTURE_EXTENSION] || [];
			var towers = structByType[STRUCTURE_TOWER] || [];
			var storage = structByType[STRUCTURE_STORAGE] || [];
			var targets = _.filter(spawns.concat(extensions).concat(towers).concat(storage), (s) => s.store.getCapacity() < s.store[RESOURCE_ENERGY]);
			var time = Game.cpu.getUsed();
			var target = creep.pos.findClosestByPath(targets);
			console.log('Time used path: '+(Game.cpu.getUsed()-time).toFixed(4));
			var time = Game.cpu.getUsed();
			var target = creep.pos.findClosestByRange(targets);
			console.log('Time used range: '+(Game.cpu.getUsed()-time).toFixed(4));
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false});
			}
		} else {
			var containers = structByType[STRUCTURE_CONTAINER] || [];
			var targets = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, (creep.store.getCapacity() - creep.store[RESOURCE_ENERGY])));
			if (targets.length > 0) {
				var target = creep.pos.findClosestByPath(targets);
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target, {ignoreCreeps: false});
				}
			}
		}
	}
};
