'use strict';

const state = require('./state');
const deepAssign = require('deep-assign');

function *idGenerator() {
	for(let i=1;; i++)
		yield i;
}

module.exports = () => {
	let lights = { },
		idGen = idGenerator();

	let wrapper = {
		'create': config => {
			let id = idGen.next().value,
				light = Object.assign({ 
					id,
					'name': 'Light ' + id,
					'state': state(),
					'type': 'Extended color light',
					'modelid': 'LCT010',
					'swversion': '66009461',
					'update': obj => deepAssign(light, obj)
				}, config);

			lights[id] = Object.assign(light, wrapper.factory(light));

			return light;
		},
		'get': id => lights[id],
		'delete': id => delete lights[id],
		'list': () => Object.assign({ }, lights),
		'factory': light => ({ }),
		'reference': lights
	};

	return wrapper;
};