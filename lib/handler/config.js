'use strict';

const uuid = require('uuid');

const basicProperties = [ 'name', 'apiversion', 'swversion', 'mac', 'modelid' ];

module.exports = bridge => {
	bridge.api.emitter.on('authentication', (username, allow, deny) => {
		if(username in bridge.config.get('whitelist')) allow();
		else deny();
	});

	bridge.api.emitter.on('config.basic', respond => {
		let res = { };

		basicProperties.forEach(p => res[p] = bridge.config.get(p) );

		respond.success(res);
	});

	bridge.api.emitter.on('config.createuser', (respond, body) => {
		let linkbutton = bridge.config.get('linkbutton');

		if(linkbutton) {
			let username = uuid.v4();

			bridge.config.addUser(username);
			respond.success({ username });
		} else {
			respond.error(101);
		}
	});

	bridge.api.emitter.on('config.list', (respond, body) => respond.success(bridge.config.list()) );

	bridge.api.emitter.on('config.update', (respond, body) => {
		bridge.config.update(body);

		respond.success();
	});

	bridge.api.emitter.on('config.deleteuser', (respond, body, username, target) => {
		bridge.config.delUser(target);

		respond.success();
	});

	bridge.api.emitter.on('config.full', (respond, body) => respond.success(bridge.state()) );
};