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
		var ruins = Game.rooms[this.room.name].ruins;
		if (dropedEnergy) {
			var targets = dropedEnergy;
			var target = this.pos.findClosestByRange(targets);
			if (this.pickup(target) == ERR_NOT_IN_RANGE) {
				this.travelTo(target, {ignoreCreeps: false});
			}
		} else if (ruins.length > 0) {
			var targets = ruins;
		} else if (energyStorage.length == 0 && this.pos.findClosestByPath(Game.rooms[room.name].sources, { ignoreCreeps: false }) !== null) {
			this.mine();
		} else if (energyStorage.length == 0) {
			var targets = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		} else {
			var targets = _.filter(energyStorage, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		}
		var target = this.pos.findClosestByRange(targets);
		if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.travelTo(target, {ignoreCreeps: false});
		}
	}
	Creep.prototype.mine =
	function() {
		var target = this.pos.findClosestByPath(Game.rooms[room.name].sources, { ignoreCreeps: false });
		if (target) {
			if (target.energy > 0) {
				if (this.harvest(target) == ERR_NOT_IN_RANGE) {
					this.travelTo(target,{ignoreCreeps: false});
				}
			}
		}
	}
};
