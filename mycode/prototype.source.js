module.exports = function() {

	Object.defineProperty(Source.prototype, 'memory', {
		configurable: true,
		get: function() {
			if(_.isUndefined(this.room.memory.sources)) {
				this.room.memory.sources = {};
			}
			if(!_.isObject(this.room.memory.sources)) {
				return undefined;
			}
			return this.room.memory.sources[this.id] =
					this.room.memory.sources[this.id] || {};
		},
		set: function(value) {
			if(_.isUndefined(this.room.memory.sources)) {
				this.room.memory.sources = {};
			}
			if(!_.isObject(this.room.memory.sources)) {
				throw new Error('Could not set source memory');
			}
			this.room.memory.sources[this.id] = value;
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
