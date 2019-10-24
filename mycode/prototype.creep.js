module.exports = function() {
	Creep.prototype.getTarget =
	function() {

	}
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
			let energySupply = this.pos.findClosestByRange(dropedEnergy);
			if (this.pickup(energySupply) == ERR_NOT_IN_RANGE) {
				this.travelTo(energySupply, {ignoreCreeps: false});
			}
		}
		else {
			switch (this.memory.role) {
				case "supplier":
					var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
					if (energySupplies.length > 0) {
						let energySupply = this.pos.findClosestByRange(energySupplies);
						if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							this.travelTo(energySupply, {ignoreCreeps: false});
						}
					}
					break;
				default:
					if (ruins.length) {
						var energySupplies = ruins;
					} else if (!energyStorage.length && this.pos.findClosestByPath(Game.rooms[this.room.name].sources, { ignoreCreeps: false }) !== null) {
						this.mine();
					} else if (!energyStorage.length) {
						var energySupplies = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
					} else if (!this.room.storage) {
						var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
					} else {
						var energySupply = storage;
					}
					if (!energySupply) {
						var energySupply = this.pos.findClosestByRange(energySupplies);
					}
					if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.travelTo(energySupply, {ignoreCreeps: false});
					}
			}
		}
	}
	Creep.prototype.mine =
	function() {
		let energySupply = this.pos.findClosestByPath(Game.rooms[this.room.name].sources, { ignoreCreeps: false });
		if (energySupply) {
			if (energySupply.energy > 0) {
				if (this.harvest(energySupply) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply,{ignoreCreeps: false});
				}
			}
		}
	}
};
