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
		if (!dropedEnergy) {
			var dropedEnergy = this.pos.findClosestByPath(_.filter(FIND_DROPPED_RESOURCES,(r) => r.resourceType == RESOURCE_ENERGY && r.amount >= 100));
		}
		if (dropedEnergy) {
			console.log(this.name+' test');
			this.moveToEnergy(dropedEnergy);
		} else {
			var structByType = Game.rooms[this.room.name].structByType;
			var containers = structByType[STRUCTURE_CONTAINER] || [];
			var storages = structByType[STRUCTURE_STORAGE] || [];
			var targets = _.filter((containers.concat(storages)), (s) => s.store[RESOURCE_ENERGY] >= this.store.getCapacity() - this.store[RESOURCE_ENERGY]);
			var target = this.pos.findClosestByPath(targets);
			this.moveToEnergy(target);
		}
	}
};
