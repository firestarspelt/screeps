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
		var structures = creep.room.lookForAt(LOOK_STRUCTURES,creep);
		if (structures.length > 0) {
			creep.repair(structures[0]);
		}
		var structByType = Game.rooms[creep.room.name].structByType;
		if (creep.memory.working) {
			var spawns = structByType[STRUCTURE_SPAWN] || [];
			var extensions = structByType[STRUCTURE_EXTENSION] || [];
			var towers = structByType[STRUCTURE_TOWER] || [];
			var storage = structByType[STRUCTURE_STORAGE] || [];
			var targets = _.filter(spawns.concat(extensions).concat(towers).concat(storage), (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
			var target = creep.pos.findClosestByRange(targets);
			if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.travelTo(target, {ignoreCreeps: false});
			}
		} else {
			var containers = structByType[STRUCTURE_CONTAINER] || [];
			var targets = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(100, creep.store.getFreeCapacity(RESOURCE_ENERGY)/2));
			if (targets.length > 0) {
				var target = creep.pos.findClosestByRange(targets);
				if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.travelTo(target, {ignoreCreeps: false});
				}
			}
		}
	}
};
