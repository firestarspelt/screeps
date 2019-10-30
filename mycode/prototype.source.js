module.exports = function() {

	Object.defineProperty(Source.prototype, 'memory', {
		configurable: true,
		get: function() {
			if(_.isUndefined(Memory.sources)) {
				Memory.sources = {};
			}
			if(!_.isObject(Memory.sources)) {
				return undefined;
			}
			return Memory.sources[this.id] =
					Memory.sources[this.id] || {};
		},
		set: function(value) {
			if(_.isUndefined(Memory.sources)) {
				Memory.mySourcesMemory = {};
			}
			if(!_.isObject(Memory.sources)) {
				throw new Error('Could not set source memory');
			}
			Memory.sources[this.id] = value;
		}
	});

	Object.defineProperty(Source.prototype, 'freeSpaceCount', {
		get: function () {
			if (this._freeSpaceCount == undefined) {
				if (this.memory.freeSpaceCount == undefined) {
					let freeSpaceCount = 0;
					[this.pos.x - 1, this.pos.x, this.pos.x + 1].forEach(x => {
						[this.pos.y - 1, this.pos.y, this.pos.y + 1].forEach(y => {
							if (Game.map.getTerrainAt(x, y, this.pos.roomName) != 'wall')
									freeSpaceCount++;
								}, this);
						}, this);
					this.memory.freeSpaceCount = freeSpaceCount;
				}
				this._freeSpaceCount = this.memory.freeSpaceCount;
			}
			return this._freeSpaceCount;
		},
		enumerable: false,
		configurable: true
	});
}
