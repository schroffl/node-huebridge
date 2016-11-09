'use strict';

const deepAssign = require('deep-assign');
const uuid = require('uuid');

module.exports = config => {
	config = Object.assign({
		'name': 'Philips Hue Bridge',
		'mac': 'aa:bb:cc:dd:ee:ff',
		'dhcp': true,
		'ipaddress': '127.0.0.1',
		'netmask': '255.255.255.0',
		'gateway': '',
		'proxyaddress': 'none',
		'proxyport': 0,
		'UTC': new Date(),
		'localtime': 'none',
		'timezone': 'Europe/Berlin',
		'whitelist': { },
		'swversion': '01035934',
		'apiversion': '1.15.0',
		'modelid': 'BSB002',
		'swupdate': {
			'updatestate': 0,
			'url': '',
			'text': '',
			'notify': false
		},
		'linkbutton': true,
		'portalservices': false
	}, config);

	config.uuid = uuid.v4().slice(0, -12) + config.mac.replace(/:/g, '');

	let ref = {
		'get': key => config[key],
		'set': (key, val) => config[key] = val,
		'update': obj => config = deepAssign(config, obj),
		'list': () => Object.assign({ }, config),
		'addUser': name => config.whitelist[name] = {
			name,
			'last use date': new Date(),
			'create date': new Date()
		},
		'delUser': name => delete config.whitelist[name]
	};

	return ref;
};