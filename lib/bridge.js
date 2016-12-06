'use strict';

const http = require('http');
const EventEmitter = require('events').EventEmitter;

class HueBridgeCore {

	constructor(logStream) {
		this._logStream = logStream;

		this.api = require('./router')();
		this.ssdp = require('./ssdp')();

		this.config = require('./config')();
		this.lights = require('./lights')();
		this.groups = require('./groups')();
		this.scenes = require('./scenes')();

		require('./handler/config')(this);
		require('./handler/lights')(this);
		require('./handler/groups')(this);
		require('./handler/scenes')(this);
		require('./handler/info')(this);
		require('./handler/description')(this);
	}

	/**
	 * Start the HTTP server
	 *
	 * @param      {Number}  port    The port to listen on
	 */
	listen(port) {
		this.server = http.createServer(this.api.router);

		this.ssdp.config.ipaddress = this.config.get('ipaddress');
		this.ssdp.config.uuid = this.config.get('uuid');
		this.ssdp.config.port = port;

		this.server.listen.apply(this.server, Array.from(arguments));
		this.ssdp.peer.start();
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