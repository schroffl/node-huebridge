'use strict';

const EventEmitter = require('events').EventEmitter;
const express = require('express');

const routes = {
	'get:/description.xml': 'bridge.description',

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
	'delete:/api/:username/groups/:id': 'groups.remove',

	'get:/api/:username/scenes': 'scenes.list',
	'post:/api/:username/scenes': 'scenes.create',
	'get:/api/:username/scenes/:id': 'scenes.info',
	'put:/api/:username/scenes/:id': 'scenes.update',
	'put:/api/:username/scenes/:id/lights/:lid/state': 'scenes.state',
	'put:/api/:username/scenes/:id/lightstates/:lid': 'scenes.state',
	'delete:/api/:username/scenes/:id': 'scenes.remove'
};

const errors = {
	'1': 'unauthorized user',
	'2': 'body contains invalid JSON',
	'3': 'resource, $r, not available',
	'4': 'method, $m, not available for resource, $r',
	'5': 'missing parameters in body',
	'6': 'parameter, $, not available',
	'7': 'invalid value, $, for parameter, $',
	'8': 'parameter, $, is not modifiable',
	'11': 'too many items in list',
	'12': 'Portal connection required',
	'101': 'link button not pressed',
	'901': 'Internal error, $'
};

module.exports = () => {
	const router = express();
	const emitter = new EventEmitter();

	router.use('/api/:username', (req, res, next) => {
		let username = req.params.username;

		emitter.emit('authentication', username, next, function() {
			let args = Array.from(arguments),
				getBasicInfo = [
					req.path === '/config',
					username === 'config' && req.path === '/'
				].reduce((result, current) => result || current, false);

			if(getBasicInfo)
				emitter.emit('config.basic', { 
					'success': module.exports.success.bind(null, req, res), 
					'error': module.exports.error.bind(null, req, res)
				});
			else
				module.exports.error(req, res, 1);
		});		
	});

	router.use((req, res, next) => {
		let rawBody = '';

		req.on('data', data => rawBody += data);
		req.on('end', () => {
			try {
				req.body = rawBody.length > 0 ? JSON.parse(rawBody) : { };
				next();
			} catch(err) {
				module.exports.error(req, res, 2);
			}
		});
	});

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
			let params = keys.map(key => req.params[key]);

			let respond = { 
				'success': module.exports.success.bind(null, req, res),
				'error': module.exports.error.bind(null, req, res)
			};

			emitter.emit.apply(emitter, [ event, respond, req.body ].concat(params));
		});

		router.all(path, (req, res, next) => {
			req.routeExists = true;
			next();
		});
	}

	router.use((req, res) => {
		if(req.routeExists)
			module.exports.error(req, res, 4);
		else
			module.exports.error(req, res, 3);
	});

	return { router, emitter };
};

module.exports.success = function(req, res) {
	let method = req.method.toUpperCase(),
		resource = req.url.replace(/^\/api\/(?:\w|[-_])+\//, '/').replace(/\/*$/, ''),
		body = req.body,
		args = Array.from(arguments).slice(2),
		json;

	switch(method) {
		case 'GET':
			json = args.shift();
			break;

		case 'DELETE':
			json = [ { 'success': `${resource} deleted` } ];
			break;

		case 'POST':
			json = [ ];

			args.forEach(item => json.push({ 'success': { [item[0]]: item[1] } }) );
			break;

		case 'PUT':
			json = [ ];

			Object.keys(body).forEach(param => json.push({ 'success': { [`${resource}/${param}`]: body[param] } }) );
			break;
	}

	if(typeof json !== 'object')
		res.end(json);
	else
		res.json(json);
};

module.exports.error = function(req, res, code) {
	let method = req.method.toUpperCase(),
		resource = req.url.replace(/^\/api\/\w+\//, '/').replace(/\/*$/, ''),
		args = Array.from(arguments).slice(3);

	let msgRaw = errors[code], i = 0,
		msg = msgRaw.replace(/\$m/g, method).replace(/\$r/g, resource).replace(/\$/g, () => args[i++]);

	res.status(500).json({
		'type': code,
		'address': resource,
		'description': msg
	});
};