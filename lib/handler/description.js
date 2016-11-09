'use strict';

const xml = require('data2xml')();

module.exports = (bridge, config) => {
	let ip = config.ipaddress,
		port = config.port,
		uuid = config.uuid;

	bridge.api.emitter.on('bridge.description', respond => {
		let name = bridge.config.get('name');

		let json = {
			'_attr': { 'xmlns': 'urn:schemas-upnp-org:device:-1-0' },
			'specVersion': { 'major': 1, 'minor': 0 },
			'URLBase': `http://${ip}:${port}/`,
			'device': {
				'deviceType': 'urn:schemas-upnp-org:device:Basic:1',
				'friendlyName': name,
				'modelName': 'Philips hue bridge 2015',
				'modelNumber': 'BSB002',
				'udn': `uuid:${uuid}`
			}
		};

		let data = xml('root', json);

		respond.success(data);
	});
};