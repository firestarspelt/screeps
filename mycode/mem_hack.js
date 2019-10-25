module.exports = function() {
	global.mem_hack = function(){
	  if(Game.time != global.compile_tick) {
	    if(global.memhack_lastTime && global.memhack_LastMemory && Game.time == (global.memhack_lastTime + 1)){
	      delete global.Memory
	      global.Memory = global.memhack_LastMemory
	      RawMemory._parsed = global.memhack_LastMemory
	    }else{
	      Memory;
	      if(!Game.rooms['sim']) {
	        global.memhack_LastMemory = RawMemory._parsed
	        global.memhack_lastTime = Game.time
	      }
	    }
	  } else {
	    Memory;
	    global.memhack_LastMemory = RawMemory._parsed
	    global.memhack_lastTime = Game.time
	  }
	}
}
