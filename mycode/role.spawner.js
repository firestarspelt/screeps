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
		var structByType = Game.rooms[spawner.room.name].structByType;
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
	let creepsInRoom = room.find(FIND_MY_CREEPS);
	/** @type {Object<string, number>} */
	let numberOfCreeps = {};
	for (let role of listOfRoles) {
        numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
    }
}
const roleSpawner = {
	/** @param {StructureSpawn} spawner */
	run: function(spawner) {
		//find sources and put them in spawns memory
		/*if (!spawner.memory.minePos) {
			spawner.memory.minePos = spawner.room.find(FIND_SOURCES);
			console.log(spawner.name + ' found sources');
		}*/
		/*Gets count of creeps with each role in the room of the spawn,
		and energy available to spawn with and get time since last spawn*/
		var creeps = spawner.room.find(FIND_MY_CREEPS);
		var creepsByRole = _.groupBy(creeps, 'memory.role');
		var structByType = Game.rooms[spawner.room.name].structByType;
		var containers = structByType[STRUCTURE_CONTAINER] || [];
		var harvesters = creepsByRole['harvester'] || [];
		var builders = creepsByRole['builder'] || [];
		var upgraders = creepsByRole['upgrader'] || [];
		var repairers = creepsByRole['repairer'] || [];
		var suppliers = creepsByRole['supplier'] || [];
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
			if (harvesters.length < 2) {
				spawnNew(energyAvail, 'harvester', spawner);
			} else if (suppliers.length < 2 && containers.length > 0) {
				spawnNew(energyAvail, 'supplier', spawner);
			} else if (repairers.length < 2) {
				spawnNew(energyAvail, 'repairer', spawner);
			} else if (upgraders.length < 1) {
				spawnNew(energyAvail, 'upgrader', spawner);
			} else if (builders.length < 2) {
				spawnNew(energyAvail, 'builder', spawner);
			}
		}
	}
}
profiler.registerObject(roleSpawner, 'roleSpawner');
module.exports = roleSpawner;
