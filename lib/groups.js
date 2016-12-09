'use strict';

const state = require('./state');
const deepAssign = require('deep-assign');

function *idGenerator() {
	for(let i=1;; i++)
		yield i;
}

module.exports = () => {
	let groups = { },
		idGen = idGenerator();

	let wrapper = {
		'create': config => {
			let id = idGen.next().value,
				group = Object.assign({
					id,
					'name': 'Group ' + id,
					'type': 'LightGroup',
					'state': state(),
					'lights': [ ],
					'update': obj => deepAssign(group, obj)
				}, config);

			groups[id] = Object.assign(group, wrapper.factory(group));

			return group;
		},
		'get': id => groups[id],
		'delete': id => delete groups[id],
		'list': () => Object.assign({ }, groups),
		'factory': group => ({ }),
		'reference': groups
	};

	return wrapper;
};
