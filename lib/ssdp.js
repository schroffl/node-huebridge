'use strict';

const ssdp = require('peer-ssdp');

module.exports = config => {
	let peer = ssdp.createPeer();

	let response = {
		'CACHE-CONTROL': 'max-age=100',
		'LOCATION': `http://${config.ipaddress}:${config.port}/description.xml`,
		'SERVER': 'FreeRTOS/6.0.5 UPnP/1.0 IpBridge/0.1',
		'ST': 'upnp:rootdevice',
		'USN': `uuid:${config.uuid}::upnp:rootdevice`
	};

	peer.on('ready', () => setInterval(() => peer.alive(response), 3000) )
		.on('search', (headers, address) => {
			console.log(address.address, 'is searching');
			peer.reply(response, address);
		});

	peer.start();
};