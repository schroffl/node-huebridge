'use strict';

const deepAssign = require('deep-assign');

module.exports = bridge => {
	bridge.api.emitter.on('groups.list', respond => respond.success(bridge.groups.list()) );

	bridge.api.emitter.on('groups.create', (respond, body) => {
		let group = bridge.groups.create(body);

		respond.success([ 'id', group.id ]);
	});

	bridge.api.emitter.on('groups.info', (respond, body, username, id ) => respond.success(bridge.groups.get(id)) );

	bridge.api.emitter.on('groups.update', (respond, body, username, id) => {
		let group = bridge.groups.get(id);

		group.update(body);
		respond.success();
	});

	bridge.api.emitter.on('groups.state', (respond, body, username, id) => {
		let group = bridge.groups.get(id);

		if(id != 0 && !group)
			return respond.error(3);
		else if('scene' in body) {
			let scene = bridge.scenes.get(body.scene);

			Object.keys(scene.lightstates)
				.filter(lid => id == 0 ? true : group.lights.indexOf(lid) > -1)
				.forEach(lid =>	bridge.lights.get(lid).update({ 'state': scene.lightstates[lid] }) );
		} else {
			group.update({ 'state': body });

			group.lights.forEach(lid => {
				let light = bridge.lights.get(lid);

				light.update({ 'state': body });
			});
		}

		respond.success();
	});

	bridge.api.emitter.on('groups.remove', (respond, body, username, id) => {
		bridge.groups.delete(id);

		respond.success();
	});
};