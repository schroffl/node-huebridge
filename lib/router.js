'use strict';

const express = require('express');

const routes = {
	'post:/api': 'config.createuser',
	'get:/api/:username/config': 'config.list',
	'put:/api/:username/config': 'config.update',
	'delete:/api/:username/config/whitelist/:target': 'config.deleteuser',
	'get:/api/:username': 'config.full',

	'get:/api/:username/lights': 'lights.list',
	'get:/api/:username/lights/new': 'lights.new',
	'post:/api/:username/lights': 'lights.search',
	'get:/api/:username/lights/:id': 'lights.info',
	'put:/api/:username/lights/:id': 'lights.rename',
	'put:/api/:username/lights/:id/state': 'lights.state',
	'delete:/api/:username/lights/:id': 'lights.remove',

	'get:/api/:username/groups': 'groups.list',
	'post:/api/:username/groups': 'groups.create',
	'get:/api/:username/groups/:id': 'groups.info',
	'put:/api/:username/groups/:id': 'groups.update',
	'put:/api/:username/groups/:id/action': 'groups.state',
	'delete:/api/:username/groups/:id': 'groups.remove'
};

module.exports = function(emit) {
	const router = express();	

	for(let route in routes) {
		let parts = route.split(':');
		
		let method = parts.shift(),
			path = parts.join(':'),
			event = routes[route];

		let reg = /:(\w+)\/?/gi,
			m, keys = [ ];

		while((m = reg.exec(path)) !== null)
			keys.push(m[1]);

		router[method](path, (req, res) => {
			let respond = (obj, status) => res.status(status || 200).json(obj);
			let params = keys.map(key => req.params[key]);

			emit.apply(null, [ event, respond ].concat(params));
		});
	}

	return router;
};