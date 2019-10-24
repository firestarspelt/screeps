module.exports = function() {
	Creep.prototype.getTarget =
	function() {
		switch (this.memory.role) {
			case "supplier":
			let structByType = Game.rooms[this.room.name].structByType;
			let spawns = structByType[STRUCTURE_SPAWN] || [];
			let extensions = structByType[STRUCTURE_EXTENSION] || [];
			let towers = structByType[STRUCTURE_TOWER] || [];
			let supplyTargets = (spawns.concat(extensions).concat(towers));
			let filteredTargets = _.filter(supplyTargets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
			let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
			let targetSpawns = this.pos.findInRange(targetsByType[STRUCTURE_SPAWN], 25);
			let targetExtensions = this.pos.findInRange(targetsByType[STRUCTURE_EXTENSION], 20);
			let targetTowers = targetsByType[STRUCTURE_TOWER] || [];
			if (targetSpawns.length || targetExtensions.length) {
				let target = this.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
				this.memory.target = target.id;
			} else if (targetTowers.length) {
				let target = this.pos.findClosestByRange(targetTowers);
				this.memory.target = target.id;
			} else if (this.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
				let target = this.room.storage;
				this.memory.target = target.id;
			}
			break;

			case "repairer"://if repairer run this
			//get room vars
			let walls = Game.rooms[this.room.name].walls;
			let infrastructure = Game.rooms[this.room.name].infrastructure;
			//find some infrastructure to repair
			if (infrastructure.length) {
				this.memory.target = infrastructure[0].id;
				this.memory.targetOldHits = infrastructure[0].hits;
				break;
			}
			//if repairer still doesn't have a target and walls are repairable, find a wall to repair
			if (this.room.controller.level > 1 && walls.length) {
				this.memory.target = walls[0].id;
				this.memory.targetOldHits =  walls[0].hits;
			}
		}
	}
	Creep.prototype.getEnergy =
	function() {
		let resByType = Game.rooms[this.room.name].resByType;
		let dropedEnergy = resByType[RESOURCE_ENERGY] || [];
		let structByType = Game.rooms[this.room.name].structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let containers = structByType[STRUCTURE_CONTAINER] || [];
		let storage = this.room.storage;
		let ruins = Game.rooms[this.room.name].ruins;
		switch (this.memory.role) {
			case "supplier":
			if (dropedEnergy.length) {
				let energySupply = this.pos.findClosestByRange(dropedEnergy);
				if (this.pickup(energySupply) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply, {ignoreCreeps: false});
				}
			} else {
				if (ruins.length) {
					var energySupplies = ruins;
				}
				else {
					var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				if (energySupplies.length) {
					let energySupply = this.pos.findClosestByRange(energySupplies);
					if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.travelTo(energySupply, {ignoreCreeps: false});
					}
				}
			}
			break;

			default:
			let energyStorage = containers.push(storage);
			if (ruins.length) {
				var energySupplies = ruins;
			} else if (!energyStorage && this.pos.findClosestByPath(Game.rooms[this.room.name].sources, { ignoreCreeps: false }) !== null) {
				this.mine();
			} else if (!energyStorage) {
				var energySupplies = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
			} else if (!storage) {
				var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
			} else if (storage) {
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
