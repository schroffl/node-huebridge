'use strict';

const util = require('util');

module.exports = (namespace, stream) => {
	return function() {
		if(!stream)
			return;

		let args = Array.from(arguments),
			msg = util.format.apply(null, args) + '\n';

		msg = `[${namespace}] ${msg}`;

		stream.write(msg);
	};
};