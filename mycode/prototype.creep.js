module.exports = function() {
	Creep.prototype.getTarget =
	function() {
		//get room vars
		let walls = this.room.walls;
		let infrastructure = this.room.infrastructure;
		let structByType = this.room.structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let extensions = structByType[STRUCTURE_EXTENSION] || [];
		let towers = structByType[STRUCTURE_TOWER] || [];
		let supplyTargets = (spawns.concat(extensions).concat(towers));
		let filteredTargets = _.filter(supplyTargets, (s) => (s.store.getFreeCapacity(RESOURCE_ENERGY) > 0));
		let targetsByType = _.groupBy(filteredTargets, (s) => s.structureType);
		let targetSpawns = this.pos.findInRange(targetsByType[STRUCTURE_SPAWN], 25);
		let storage = this.room.storage;
		let targetExtensions = this.pos.findInRange(targetsByType[STRUCTURE_EXTENSION], 20);
		let targetTowers = targetsByType[STRUCTURE_TOWER] || [];
		switch (this.memory.role) {
			case "supplier":
				if (targetSpawns.length || targetExtensions.length) {
					let target = this.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
					this.memory.target = target.id;
				} else if (targetTowers.length) {
					let target = this.pos.findClosestByRange(targetTowers);
					this.memory.target = target.id;
				} else if (storage) {
					if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
						let target = storage;
						this.memory.target = target.id;
					}
				}
				break;

			case "repairer"://if repairer run this
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
				break;

			case "claimer":
				flagTarget: {
					let reserve = global.flagsByType['reserve'] || [];
					for (let name in reserve) {
						if (Game.flags[name].memory.claimers == 0) {
							creep.memory.target = name;
							++Game.flags[name].memory.claimers;
							break flagTarget;
						}
					}
					let claim = global.flagsByType['claim'] || [];
					for (let name in claim) {
						if (Game.flags[name].memory.claimers == 0) {
							creep.memory.target = name;
							++Game.flags[name].memory.claimers;
							break flagTarget;
						}
					}
				}
				break;
		}
	}
	Creep.prototype.getEnergy =
	function() {
		//get room vars
		let resByType = this.room.resByType;
		let dropedEnergy = resByType[RESOURCE_ENERGY] || [];
		let structByType = this.room.structByType;
		let spawns = structByType[STRUCTURE_SPAWN] || [];
		let containers = structByType[STRUCTURE_CONTAINER] || [];
		let storage = this.room.storage;
		let ruins = this.room.ruins;
		let tombstones = this.room.tombstones;
		//run based off role
		switch (this.memory.role) {
			case "supplier"://if supplier
			//get dropedEnergy
			if (dropedEnergy.length) {
				let energySupply = this.pos.findClosestByRange(dropedEnergy)
				if (this.pickup(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply, {ignoreCreeps: false, offRoad: true});
				}
				else {
					energySupply = this.pos.findClosestByRange(containers);
					this.withdraw(energySupply, RESOURCE_ENERGY);
				}
			}//if no dropedEnergy get tombstones with energy
			else if (tombstones.length) {
				var energySupplies = tombstones;
			}
			//if no tombstones get ruins with energy
			else if (ruins.length) {
				var energySupplies = ruins;
			}
			//otherwise get containers with energy
			else {
				var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
			}
			//if there is a target list find closest and get energy from it
			if (energySupplies) {
				let energySupply = this.pos.findClosestByRange(energySupplies);
				if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply, {ignoreCreeps: false, offRoad: true});
				}
			}
			break;

			default:
			if (ruins.length) {
				var energySupplies = ruins;
			}
			else if (storage) {
				var energySupply = storage;
			}
			else if (containers.length) {
				var energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
			}
			else if ((!containers && !storage) && this.pos.findClosestByPath(this.room.sources, { ignoreCreeps: false })) {
				this.mine();
			}
			else if (spawns) {
				var energySupplies = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
			}
			if (energySupplies) {
				var energySupply = this.pos.findClosestByRange(energySupplies);
			}
			if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.travelTo(energySupply, {ignoreCreeps: false});
			}
		}
	}
	Creep.prototype.mine =
	function() {
		let energySupply = this.pos.findClosestByPath(this.room.sources, { ignoreCreeps: false });
		if (energySupply) {
			if (energySupply.energy > 0) {
				if (this.harvest(energySupply) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply,{ignoreCreeps: false});
				}
			}
		}
	}
};
