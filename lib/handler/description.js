'use strict';

const xml = require('data2xml')();

module.exports = bridge => {
	bridge.api.emitter.on('bridge.description', respond => {
		let json = {
			'_attr': { 'xmlns': 'urn:schemas-upnp-org:device:-1-0' },
			'specVersion': { 'major': 1, 'minor': 0 },
			'URLBase': `http://${bridge.config.get('ipaddress')}:${bridge.config.get('port')}/`,
			'device': {
				'deviceType': 'urn:schemas-upnp-org:device:Basic:1',
				'friendlyName': bridge.config.get('name'),
				'modelName': 'Philips hue bridge 2015',
				'modelNumber': 'BSB002',
				'udn': `uuid:${bridge.config.get('uuid')}`
			}
		};

		let data = xml('root', json);

		respond.success(data);
	});
};