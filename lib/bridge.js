'use strict';

const http = require('http');
const EventEmitter = require('events').EventEmitter;

class HueBridgeCore {

	constructor(logStream) {
		this._logStream = logStream;

		this.api = require('./router')();

		this.config = require('./config')();
		this.lights = require('./lights')();
		this.groups = require('./groups')();
		this.scenes = require('./scenes')();

		require('./handler/config')(this);
		require('./handler/lights')(this);
		require('./handler/groups')(this);
		require('./handler/scenes')(this);
		require('./handler/info')(this);
	}

	/**
	 * Start the HTTP server
	 *
	 * @param      {Number}  port    The port to listen on
	 */
	listen(port) {
		this.server = http.createServer(this.api.router);

		this.initSSDP(port);

		this.server.listen.apply(this.server, Array.from(arguments));
	}

	/**
	 * Start the SSDP Service
	 */
	initSSDP(port) {
		let config = {
			'ipaddress': this.config.get('ipaddress'),
			'uuid': this.config.get('uuid'),
			'port': port
		};

		this.ssdp = require('./ssdp')(config);
		require('./handler/description')(this, config);
	}

	/**
	 * Get the full state of the bridge
	 *
	 * @return     {Object}  State of the bridge
	 */
	state() {
		return {
			'config': this.config.list(),
			'lights': this.lights.list(),
			'groups': this.groups.list(),
			'scenes': this.scenes.list()
		}
	}
}

module.exports = HueBridgeCore;