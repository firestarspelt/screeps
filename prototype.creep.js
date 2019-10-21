module.exports = function() {
	Creep.prototype.getEnergy =
	function() {
		var resByType = Game.rooms[this.room.name].resByType;
		var dropedEnergy = resByType[RESOURCE_ENERGY];
		var structByType = Game.rooms[this.room.name].structByType;
		var spawns = structByType[STRUCTURE_SPAWN] || [];
		var containers = structByType[STRUCTURE_CONTAINER] || [];
		var storage = structByType[STRUCTURE_STORAGE] || [];
		var energyStorage = containers.concat(storage);
		if (dropedEnergy) {
			var targets = dropedEnergy;
		} else if (energyStorage.length == 0) {
			var targets = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		} else if (!targets) {
			var targets = _.filter(energyStorage, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		}
		var target = this.pos.findClosestByPath(targets);
		if (this.pos.isNearTo(target)) {
			this.withdraw(target, RESOURCE_ENERGY)
		} else {
			this.travelTo(target, {ignoreCreeps: false});
		}
	}
	Creep.prototype.mine =
	function() {
		var target = this.pos.findClosestByPath(FIND_SOURCES,{ ignoreCreeps: false });
		if (target.energy > 0) {
			if (this.harvest(target) == ERR_NOT_IN_RANGE) {
				this.travelTo(target,{ignoreCreeps: false});
			}
		}
	}
};
