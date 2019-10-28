module.exports = function() {
	Creep.prototype.getTarget =
	function() {
		//get room vars
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
			case "supplier": {
				let target;
				if (targetSpawns.length || targetExtensions.length) {
					target = this.pos.findClosestByRange(targetSpawns.concat(targetExtensions));
					this.memory.target = target.id;
				} else if (targetTowers.length) {
					target = this.pos.findClosestByRange(targetTowers);
					this.memory.target = target.id;
				} else if (storage) {
					if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
						target = storage;
						this.memory.target = target.id;
					}
				}
				break;
			}
			case "repairer": {//if repairer run this
				//get room vars
				let walls = this.room.walls;
				let infrastructure = this.room.infrastructure;
				//find some infrastructure to repair
				if (infrastructure.length) {
					this.memory.target = infrastructure[0].id;
					this.memory.targetOldHits = infrastructure[0].hits;
					break;
				}
				flagTarget: {
					if (!this.memory.flag) {
						let maintain = global.flagsByType['maintain'] || [];
						for (let flag of maintain) {
							if (!flag.memory.repairers || flag.memory.repairers == 0) {
								this.memory.flag = flag.name;
								++flag.memory.repairers;
								break flagTarget;
							}
						}
					}
				}
				//get flag from memory
				let flag = Game.flags[this.memory.flag];
				if (flag && flag.room) {
					infrastructure = flag.room.infrastructure;
					if (infrastructure.length) {
						this.memory.target = infrastructure[0].id;
						this.memory.targetOldHits = infrastructure[0].hits;
						break;
					}
				}
				//if repairer still doesn't have a target and walls are repairable, find a wall to repair
				if (this.room.controller.level > 1 && walls.length) {
					this.memory.target = walls[0].id;
					this.memory.targetOldHits =  walls[0].hits;
				}
				break;
			}
			case "claimer": {
				flagTarget: {
					let reserve = global.flagsByType['reserve'] || [];
					for (let flag of reserve) {
						if (!flag.memory.claimers || flag.memory.claimers == 0) {
							this.memory.flag = flag.name;
							++flag.memory.claimers;
							break flagTarget;
						}
					}
					let claim = global.flagsByType['claim'] || [];
					for (let flag of claim) {
						if (!flag.memory.claimers || flag.memory.claimers == 0) {
							this.memory.flag = flag.name;
							++flag.memory.claimers;
							break flagTarget;
						}
					}
				}
				break;
			}
			case "builder": {
				//get room vars
				let constuctByType = this.room.constuctByType;
				let containers = constuctByType[STRUCTURE_CONTAINER] || [];
				let extensions = constuctByType[STRUCTURE_EXTENSION] || [];
				let targets;
				//if there are containers to build, build them
				if (containers.length) {
					this.memory.target = this.pos.findClosestByRange(containers).id;
				}
				//otherwise if there are extensions to build, build them
				else if (extensions.length) {
					this.memory.target = this.pos.findClosestByRange(extensions).id;
				}
				//otherwise build closest construction site
				else {
					targets = this.room.constuctSites;
					if (targets.length) {
						this.memory.target = this.pos.findClosestByRange(targets).id;
					}
				}
				flagTarget: {
					let maintain = global.flagsByType['maintain'] || [];
					for (let flag of maintain) {
						if (!flag.memory.builders || flag.memory.builders == 0) {
							this.memory.flag = flag.name;
							++flag.memory.builders;
							break flagTarget;
						}
					}
				}
				break;
			}
		}
		return;
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
			case "supplier": {//if supplier
				//get dropedEnergy
				let energySupplies;
				let energySupply;
				if (dropedEnergy.length) {
					energySupply = this.pos.findClosestByRange(dropedEnergy)
					if (this.pickup(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.travelTo(energySupply, {ignoreCreeps: false, offRoad: true});
					}
					else {
						energySupply = this.pos.findClosestByRange(containers);
						this.withdraw(energySupply, RESOURCE_ENERGY);
					}
				}//if no dropedEnergy get tombstones with energy
				else if (tombstones.length) {
					energySupplies = tombstones;
				}
				//if no tombstones get ruins with energy
				else if (ruins.length) {
					energySupplies = ruins;
				}
				//otherwise get containers with energy
				else {
					energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				//if there is a target list find closest and get energy from it
				if (energySupplies) {
					energySupply = this.pos.findClosestByRange(energySupplies);
					if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						this.travelTo(energySupply, {ignoreCreeps: false, offRoad: true});
					}
				}
				break;
			}
			default: {
				let energySupplies;
				let energySupply;
				if (ruins.length) {
					energySupplies = ruins;
				}
				else if (storage) {
					energySupply = storage;
				}
				else if (containers.length) {
					energySupplies = _.filter(containers, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				else if ((!containers.length && !storage) && this.pos.findClosestByPath(this.room.sources, { ignoreCreeps: false })) {
					this.mine();
				}
				else if (spawns) {
					energySupplies = _.filter(spawns, (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.store.getFreeCapacity(RESOURCE_ENERGY)));
				}
				if (energySupplies) {
					energySupply = this.pos.findClosestByRange(energySupplies);
				}
				if (this.withdraw(energySupply, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					this.travelTo(energySupply, {ignoreCreeps: false});
				}
			}
		}
		return;
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
		return;
	}
};
