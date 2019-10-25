const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleSupplier = require('role.supplier');
const roleSpawner = require('role.spawner');
const roleTower = require('role.tower');
const roleRoom = require('role.room');
const profiler = require('screeps-profiler');
const Traveler = require('Traveler');
const roleClaimer = require('role.claimer');
require('prototype.spawn') ();
require('prototype.creep') ();
require('prototype.source') ();
require('mem_hack') ();
profiler.enable();
module.exports.loop = function() {
	global.mem_hack();
	profiler.wrap(function() {
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
			} catch(err) {
				console.log('error caused by ' + spawn.name + ' ' + err);
			}
		}
		//iterate through creeps and run their code
		for (let name in Game.creeps) {
			let creep = Game.creeps[name];
			try {
				if (!creep.spawning) {
					switch (creep.memory.role) {
						case "harvester":
							roleHarvester.run(creep);
							break;
						case "upgrader":
							roleUpgrader.run(creep);
							break;
						case "builder":
							roleBuilder.run(creep);
							break;
						case "repairer":
							roleRepairer.run(creep);
							break;
						case "supplier":
							roleSupplier.run(creep);
							break;
						case "claimer":
							roleClaimer.run(creep);
							break;
						default:
							console.log('error caused by ' + creep.name + " has no role or it's role isn't run");
					}
				}
			} catch(err){
				console.log('error caused by ' + creep.memory.role + ' ' + (err.stack || err));
			}
		}
		//remove dead creeps memory
		for (let name in Memory.creeps) {
			if (!Game.creeps[name]) {
				let creep = Memory.creeps[name];
				let room = Game.rooms[creep.home];
				switch (creep.role) {
					case "harvester":
						--room.memory.harvesters;
						break;
					case "upgrader":
						--room.memory.upgraders;
						break;
					case "builder":
						--room.memory.builders;
						break;
					case "repairer":
						--room.memory.repairers;
						break;
					case "supplier":
						--room.memory.suppliers;
						break;
					case "claimer":
						--room.memory.claimers;
				}
				delete Memory.creeps[name];
			}
		}
	});
}
