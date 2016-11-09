'use strict';

module.exports = config => Object.assign({
	'on': false,
	'bri': 0,
	'hue': 0,
	'sat': 0,
	'xy': [ 0, 0 ],
	'ct': 0,
	'alert': '',
	'effect': '',
	'colormode': 'hs',
	'reachable': true
}, config);