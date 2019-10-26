const profiler = require('screeps-profiler');
/** @param {Room.energyAvailable} energyAvail
 * @param {Creep.memory.role} roleName
 * @param {StructureSpawn} spawner */
function spawnNew(energyAvail, roleName, spawner) {
	/** @type {String} */
	var newName = spawner.name + ' ' + roleName + ' ' + Game.time;
	console.log('Spawning new ' + roleName + ': ' + newName);
	if (roleName == 'supplier') {
		return spawner.spawnSupplier(energyAvail, newName);
	} else if (roleName == 'harvester') {
		var structByType = spawner.room.structByType;
		var containers = structByType[STRUCTURE_CONTAINER] || [];
		if (containers.length == 0) {
			return spawner.spawnHarvester(energyAvail, newName);
		} else {
			return spawner.spawnCanHarvester(energyAvail, newName);
		}
	} else {
		return spawner.spawnDynamicCreep(energyAvail, newName, roleName);
	}
}
/** @param {Room} room**/
function spawnCreepsIfNecessary(room) {
	/** @type {Array<Creep>} */
	let creepsInRoom = spawner.room.myCreeps;
	/** @type {Object<string, number>} */
	let numberOfCreeps = {};
	for (let role of listOfRoles) {
        numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
    }
}
const roleSpawner = {
	/** @param {StructureSpawn} spawner */
	run: function(spawner) {
		/*Gets count of creeps with each role in the room of the spawn,
		and energy available to spawn with and get time since last spawn*/
		var creeps = spawner.room.myCreeps;
		var creepsByRole = _.groupBy(creeps, 'memory.role');
		var structByType = spawner.room.structByType;
		var containers = structByType[STRUCTURE_CONTAINER] || [];
		var harvesters = creepsByRole['harvester'] || [];
		var builders = creepsByRole['builder'] || [];
		var upgraders = creepsByRole['upgrader'] || [];
		var repairers = creepsByRole['repairer'] || [];
		var suppliers = creepsByRole['supplier'] || [];
		var claimers = creepsByRole['claimer'] || [];
		var energyAvail = spawner.room.energyAvailable;
		var maxEnergy = spawner.room.energyCapacityAvailable;
		++spawner.memory.timeSinceSpawn;
		/*If spawning show next to spawner what role is being spawned,
		as well as prevent from trying to spawn a new creep while it is already spawning*/
		if (spawner.spawning) {
			spawner.memory.timeSinceSpawn = 0;
			var spawningCreep = Game.creeps[spawner.spawning.name];
			spawner.room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spawner.pos.x + 1,
				spawner.pos.y,
				{align: 'left', opacity: 0.8});
			/*If 300 energy or more energy spawn a new creep
			if there are less than I want of a certain role*/
		} else if ((energyAvail >= 300 && spawner.memory.timeSinceSpawn >= 100) || energyAvail == maxEnergy) {
			if (spawner.room.memory.harvesters < 2) {
				if (spawnNew(energyAvail, 'harvester', spawner) == OK) {
					++spawner.room.memory.harvesters;
				}
			} else if (spawner.room.memory.suppliers < 2 && containers.length > 0) {
				if (spawnNew(energyAvail, 'supplier', spawner) == OK) {
					++spawner.room.memory.suppliers;
				}
			} else if (spawner.room.memory.repairers < 1) {
				if (spawnNew(energyAvail, 'repairer', spawner) == OK) {
					++spawner.room.memory.repairers;
				}
			} else if (spawner.room.memory.upgraders < 1) {
				if (spawnNew(energyAvail, 'upgrader', spawner) == OK) {
					++spawner.room.memory.upgraders;
				}
			} else if (spawner.room.memory.builders < 1) {
				if (spawnNew(energyAvail, 'builder', spawner) == OK) {
					++spawner.room.memory.builders;
				}
			} else if (spawner.room.memory.claimers < 1) {

				spawner.spawnCreep([ CLAIM , MOVE ], (spawner.name + ' claimer ' + Game.time), {memory: {role: 'claimer', moveParts: 1, totalParts: 2, home: spawner.room.name}});
				if(spawner.spawnCreep == OK){
					console.log(fuckzuler);
				}

				if (spawner.spawnCreep == OK ){
					++spawner.room.memory.claimers;
				}
			}
		}
	}
}
profiler.registerObject(roleSpawner, 'roleSpawner');
module.exports = roleSpawner;
