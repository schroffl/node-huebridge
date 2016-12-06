'use strict';

const deepAssign = require('deep-assign');

module.exports = bridge => {
	bridge.api.emitter.on('scenes.list', respond => respond.success(bridge.scenes.list()) );

	bridge.api.emitter.on('scenes.create', (respond, body) => {
		let scene = bridge.scenes.create(body);

		respond.success({ 'id': scene.id });
	});

	bridge.api.emitter.on('scenes.info', (respond, body, username, id) => respond.success(bridge.scenes.get(id)) );

	bridge.api.emitter.on('scenes.update', (respond, body, username, id) => {
		let scene = bridge.scenes.get(id);

		scene.update(body);
		respond.success();
	});

	bridge.api.emitter.on('scenes.state', (respond, body, username, id, lid) => {
		let scene = bridge.scenes.get(id);

		scene.update({ 'lightstates': { [lid]: body } })
		respond.success();
	});

	bridge.api.emitter.on('scenes.remove', (respond, body, username, id) => {
		bridge.scenes.delete(id);

		respond.success();
	});
};