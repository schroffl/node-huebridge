'use strict';

const deepAssign = require('deep-assign');

module.exports = bridge => {
	bridge.api.emitter.on('lights.list', respond => respond.success(bridge.lights.list()) );

	bridge.api.emitter.on('lights.new', respond => respond.success({ 'lastscan': 'none' }) );

	bridge.api.emitter.on('lights.search', respond => respond.success() );

	bridge.api.emitter.on('lights.info', (respond, body, username, id) => respond.success(bridge.lights.get(id)) );

	bridge.api.emitter.on('lights.rename', (respond, body, username, id) => {
		let light = bridge.lights.get(id);

		light.update({ 'name': body.name });
		respond.success();
	});

	bridge.api.emitter.on('lights.state', (respond, body, username , id) => {
		let light = bridge.lights.get(id);

		light.update({ 'state': body });
		respond.success();
	});

	bridge.api.emitter.on('lights.remove', (respond, body, username, id) => {
		bridge.lights.delete(id),

		respond.success();
	});
};