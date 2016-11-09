'use strict';

module.exports = require('./lib/bridge');

module.exports.router = require('./lib/router');
module.exports.factories = {
	'config': require('./lib/config'),
	'lights': require('./lib/lights'),
	'groups': require('./lib/groups'),
	'scenes': require('./lib/scenes')
};