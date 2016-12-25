'use strict';

const state = require('./state');
const deepAssign = require('deep-assign');
const idGenerator = require('./idgen');

module.exports = () => {
	let lights = { },
		idGen = idGenerator(id => !(id in lights));

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

			console.log(id);

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