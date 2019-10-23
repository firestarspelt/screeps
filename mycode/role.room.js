const profiler = require('screeps-profiler');
const roleRoom = {
	run: function(room) {
		if (false) {//not used yet
			var creeps = room.find(FIND_MY_CREEPS);
			var creepsByRole = _.groupBy(creeps, 'memory.role');
			var harvesters = creepsByRole['harvester'] || [];
			room.memory.harvesters = harvesters.length;
			var builders = creepsByRole['builder'] || [];
			room.memory.builders = builders.length;
			var upgraders = creepsByRole['upgrader'] || [];
			room.memory.upgraders = upgraders.length;
			var repairers = creepsByRole['repairer'] || [];
			room.memory.repairers = repairers.length;
			var suppliers = creepsByRole['supplier'] || [];
			room.memory.suppliers = suppliers.length;
			var droppedEnergy = resByType[RESOURCE_ENERGY] || [];
		}
		const hitsPercentage = (s) => (s.hits/s.hitsMax);
		//construction site variables
		Game.rooms[room.name].constuctSites = room.find(FIND_CONSTRUCTION_SITES);
		Game.rooms[room.name].constuctByType = _.groupBy(Game.rooms[room.name].constuctSites, (s) => s.structureType);

		//structure variables
		Game.rooms[room.name].structures = room.find(FIND_STRUCTURES);
		Game.rooms[room.name].damStructures = _.filter(Game.rooms[room.name].structures, (s) => hitsPercentage < 0.8);
		Game.rooms[room.name].structByType = _.groupBy(Game.rooms[room.name].structures, (s) => s.structureType);
		[Game.rooms[room.name].walls, Game.rooms[room.name].infrastructure] = _.partition(Game.rooms[room.name].damStructures, (s) => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART);
		Game.rooms[room.name].walls = _.sortBy(Game.rooms[room.name].walls, hitsPercentage);
		Game.rooms[room.name].infrastructure = _.sortBy(Game.rooms[room.name].infrastructure, hitsPercentage);

		//resource variables
		Game.rooms[room.name].sources = room.find(FIND_SOURCES);
		Game.rooms[room.name].ruins = room.find(FIND_RUINS, {filter: (r) => r.store.getUsedCapacity() > 0});
		Game.rooms[room.name].tombstones = room.find(FIND_TOMBSTONES, {filter: (t) => t.store.getUsedCapacity() > 0});
		Game.rooms[room.name].droppedRes = room.find(FIND_DROPPED_RESOURCES, {filter: (r) => r.amount > 100});
		Game.rooms[room.name].resByType = _.groupBy(Game.rooms[room.name].droppedRes, (r) => r.resourceType);

		//creep variables
		Game.rooms[room.name].myCreeps = room.find(FIND_MY_CREEPS);
		Game.rooms[room.name].enemyCreeps = room.find(FIND_HOSTILE_CREEPS);
	}
}
profiler.registerObject(roleRoom, 'roleRoom');
module.exports = roleRoom;
