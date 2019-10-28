module.exports = function() {
	/*This takes the parameters below and spawns a DynamicCreep*/
	/** @param {Energy} energyAvail @param {Creep Name} name @param {Role} roleName **/
	StructureSpawn.prototype.spawnDynamicCreep =
	function(energyAvail, name, roleName) {
		// create a balanced body
		let numParts = Math.min(Math.floor(energyAvail / 200),8);
		let body = [];
		for (let i = 0; i < numParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < numParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < numParts; i++) {
			body.push(MOVE);
		}
		//spawn creep with the body, name, and role
		return this.spawnCreep(body, name, {memory: {role: roleName, workParts: numParts, moveParts: numParts, totalParts: (numParts * 3), home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Harvester*/
	/** @param {Energy} energyAvail @param {Creep Name} name **/
	StructureSpawn.prototype.spawnHarvester =
	function(energyAvail, name) {
		let otherParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE] + BODYPART_COST[CARRY])), 3);
		let workParts = otherParts * 2;
		let body = [];
		for (let i = 0; i < workParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < otherParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < otherParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'harvester', workParts: workParts, moveParts: otherParts, totalParts: (workParts + otherParts * 2), home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Caninister Harvester*/
	/** @param {Energy} energyAvail @param {Creep.name} name **/
	StructureSpawn.prototype.spawnCanHarvester =
	function(energyAvail, name) {
		let moveParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[WORK] * 2 + BODYPART_COST[MOVE])),3);
		let workParts = moveParts * 2;
		let body = [];
		for (let i = 0; i < workParts; i++) {
			body.push(WORK);
		}
		for (let i = 0; i < moveParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'harvester', workParts: workParts, moveParts: moveParts, totalParts: (workParts + moveParts), home: this.room.name}});
	}
	/*This takes the parameters below and spawns a Supplier*/
	/** @param {Energy} energyAvail @param {Creep Name} name **/
	StructureSpawn.prototype.spawnSupplier =
	function(energyAvail, name) {
		let moveParts = Math.min(Math.floor(energyAvail / (BODYPART_COST[MOVE] + BODYPART_COST[CARRY] * 2)),8);
		let carryParts = moveParts*2;
		let body = [];
		for (let i = 0; i < carryParts; i++) {
			body.push(CARRY);
		}
		for (let i = 0; i < moveParts; i++) {
			body.push(MOVE);
		}
		return this.spawnCreep(body, name, {memory: {role: 'supplier', moveParts: moveParts, totalParts: moveParts * 3, home: this.room.name}});
	}
};
