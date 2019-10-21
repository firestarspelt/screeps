module.exports = function() {
	Creep.prototype.moveToEnergy =
	function(target) {
		if (this.pos.isNearTo(target)) {
			this.withdraw(target, RESOURCE_ENERGY)
		} else {
			this.travelTo(target, {ignoreCreeps: false});
		}
	}
	Creep.prototype.getEnergy =
	function() {
		var resByType = Game.rooms[this.room.name].resByType;
		var dropedEnergy = this.pos.findClosestByPath(resByType[RESOURCE_ENERGY]);
		if (dropedEnergy) {
			console.log(this.name+' test');
			this.moveToEnergy(dropedEnergy);
		} else {
			var structByType = Game.rooms[this.room.name].structByType;
			var containers = structByType[STRUCTURE_CONTAINER] || [];
			var storage = structByType[STRUCTURE_STORAGE] || [];
			var targets = _.filter((containers.concat(storage)), (s) => s.store[RESOURCE_ENERGY] >= Math.min(200, this.getFreeCapacity(RESOURCE_ENERGY)));
			var target = this.pos.findClosestByPath(targets);
			this.moveToEnergy(target);
		}
	}
};
