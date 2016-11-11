'use strict';

const util = require('util');

module.exports = (namespace, stream) => {
	if(!stream)
		stream = process.stdout;

	return function() {
		let args = Array.from(arguments),
			msg = util.format.apply(null, args) + '\n';

		msg = `[${namespace}] ${msg}`;

		stream.write(msg);
	};
};