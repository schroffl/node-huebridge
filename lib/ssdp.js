'use strict';

const ssdp = require('peer-ssdp');
const xml = require('data2xml')();

module.exports = bridge => {
	let peer = ssdp.createPeer();

	let ssdpResponse = () => ({
		'CACHE-CONTROL': 'max-age=100',
		'LOCATION': `http://${bridge.config.get('ipaddress')}:${bridge.config.get('port')}/description.xml`,
		'SERVER': 'FreeRTOS/6.0.5 UPnP/1.0 IpBridge/0.1',
		'ST': 'upnp:rootdevice',
		'USN': `uuid:${bridge.config.get('uuid')}::upnp:rootdevice`
	});

	peer.on('ready', () => setInterval(() => peer.alive(ssdpResponse()), 3000) )
		.on('search', (headers, address) => peer.reply(ssdpResponse(), address) );

	// Respond to HTTP GET /description.xml
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

	return peer;
};