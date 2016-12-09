'use strict';

const ssdp = require('peer-ssdp');

module.exports = bridge => {
	let peer = ssdp.createPeer();

	let response = () => ({
		'CACHE-CONTROL': 'max-age=100',
		'LOCATION': `http://${bridge.config.get('ipaddress')}:${bridge.config.get('port')}/description.xml`,
		'SERVER': 'FreeRTOS/6.0.5 UPnP/1.0 IpBridge/0.1',
		'ST': 'upnp:rootdevice',
		'USN': `uuid:${bridge.config.get('uuid')}::upnp:rootdevice`
	});

	peer.on('ready', () => setInterval(() => peer.alive(response()), 3000) )
		.on('search', (headers, address) => peer.reply(response(), address) );

	return peer;
};