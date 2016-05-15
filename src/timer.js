function TIMER() {
	"use strict";

	var __START__;

	function reset() {
		__START__ = new Date().getTime();
	}

	function getTime() {
		var current = new Date().getTime();
		return current - __START__;
	}

	return {
		getTime: getTime,
		reset: reset
	}
}