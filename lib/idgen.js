'use strict';

module.exports = function* (valid) {
	for(let i=1;; i++) {
		while(!valid(i)) i++;
		yield i;
	}
}