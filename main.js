var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleSupplier = require('role.supplier');
var roleSpawner = require('role.spawner');
var roleTower = require('role.tower');
var roleRoom = require('role.room');
const profiler = require('screeps-profiler');
var Traveler = require('Traveler');
global.lastMemoryTick = undefined;
require('prototype.spawn') ();
require('prototype.creep') ();
profiler.enable();
function tryInitSameMemory() {
    if (lastMemoryTick && global.LastMemory && Game.time == (lastMemoryTick + 1)) {
        delete global.Memory;
        global.Memory = global.LastMemory;
        RawMemory._parsed = global.LastMemory;
    } else {
        Memory;
        global.LastMemory = RawMemory._parsed;
    }
    lastMemoryTick = Game.time;
}
module.exports.loop = function() {
	//tryInitSameMemory();
	profiler.wrap(function() {
		//remove dead creeps memory
		for (let name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
			}
		}
		//iterate through rooms and create the variables
		for (let name in Game.rooms) {
			let room = Game.rooms[name];
			roleRoom.run(room);
		}
		//iterate through towers and run their code
		for (let name in Game.rooms) {
			let towers = Game.rooms[name].structByType[STRUCTURE_TOWER] || [];
			for (let id in towers) {
				let tower = towers[id];
				try {
					roleTower.run(tower);
				} catch(err) {
					console.log('error caused by ' + tower + ' ' + err);
				}
			}
		}
		//iterate through spawners and run their code
		for (let name in Game.spawns) {
			let spawner = Game.spawns[name];
			try {
				roleSpawner.run(spawner);
			} catch(err){
				console.log('error caused by ' + spawn.name + ' ' + err);
			}
		}
		//iterate through creeps and run their code
		for (var name in Game.creeps) {
			var creep = Game.creeps[name];
			try {
				if (!creep.spawning) {
					switch (creep.memory.role) {
						case "harvester":
							return roleHarvester.run(creep);

						case "upgrader":
							return roleUpgrader.run(creep);

						case "builder":
							return roleBuilder.run(creep);

						case "repairer":
							return roleRepairer.run(creep);

						case "supplier":
							return roleSupplier.run(creep);
					}
				}
			} catch(err){
				console.log('error caused by ' + creep.memory.role + ' ' + err);
			}
		}
	});
}
