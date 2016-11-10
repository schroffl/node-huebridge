'use strict';

const uuid = require('uuid');

module.exports = bridge => {
	bridge.api.emitter.on('authentication', (username, allow, deny) => {
		if(username in bridge.config.get('whitelist')) allow();
		else deny();
	});

	bridge.api.emitter.on('config.createuser', (respond, body) => {
		let username = uuid.v4();

		bridge.config.addUser(username);
		respond.success([ 'username', username ]);
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