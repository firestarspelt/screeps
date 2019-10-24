module.exports = function() {
	Creep.prototype.getEnergy =
	function() {
		let resByType = Game.rooms[this.room.name].resByType;
		let dropedEnergy = resByType[RESOURCE_ENERGY] || [];
		let structByType = Game.rooms[this.room.name].structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let containers = structByType[STRUCTURE_CONTAINER] || [];
		let storage = this.room.storage;
		let energyStorage = containers.push(storage);
		let ruins = Game.rooms[this.room.name].ruins;
		if (dropedEnergy.length > 0) {
			let target = this.pos.findClosestByRange(dropedEnergy);
			if (this.pickup(target) == ERR_NOT_IN_RANGE) {
				this.travelTo(target, {ignoreCreeps: false});
			}
		} else if (ruins.length > 0) {
			var targets = ruins;
		} else if (energyStorage.length == 0 && this.pos.findClosestByPath(Game.rooms[this.room.name].sources, { ignoreCreeps: false }) !== null) {
			this.mine();
		} else if (energyStorage.length == 0) {
			var targets = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		} else if (!this.room.storage) {
			var targets = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
		} else {
			var target = storage;
		}
		if (!target) {
			var target = this.pos.findClosestByRange(targets);
		}
		if (this.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.travelTo(target, {ignoreCreeps: false});
		}
	}
	Creep.prototype.mine =
	function() {
		let target = this.pos.findClosestByPath(Game.rooms[this.room.name].sources, { ignoreCreeps: false });
		if (target) {
			if (target.energy > 0) {
				if (this.harvest(target) == ERR_NOT_IN_RANGE) {
					this.travelTo(target,{ignoreCreeps: false});
				}
			}
		}
	}
};
