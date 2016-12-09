'use strict';

let uid = require('uid');
const deepAssign = require('deep-assign');

function *idGenerator() {
	for(;;)
		yield uid(14);
}

module.exports = () => {
	let scenes = { },
		idGen = idGenerator();

	let wrapper = {
		'create': config => {
			let id = idGen.next().value,
				scene = Object.assign({
					id,
					'name': 'Scene ' + id,
					'lights': [ ],
					'owner': '',
					'recycle': true,
					'locked': false,
					'appdata': { },
					'picture': '',
					'lastupdated': new Date(),
					'lightstates': { },
					'version': 2,
					'update': obj => deepAssign(scene, obj)
				}, config);

			scenes[id] = Object.assign(scene, wrapper.factory(scene));

			return scene;
		},
		'get': id => scenes[id],
		'delete': id => delete scenes[id],
		'list': () => Object.assign({ }, scenes),
		'factory': scene => ({ }),
		'reference': scenes
	};

	return wrapper;
};