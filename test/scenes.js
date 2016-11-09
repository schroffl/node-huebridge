'use strict';

const common = require('./common');

const request = common.request;

describe('Scenes', () => {
	let sceneId;

	it('Return a list of all scenes: GET /api/authenticated/scenes', done => {
		request
			.get('/api/authenticated/scenes')
			.expect(200, done);
	});

	it('Create a new scene: POST /api/authenticated/scenes', done => {
		request
			.post('/api/authenticated/scenes')
			.send({ 'name': 'Scene Name' })
			.expect(res => sceneId = res.body[0].success.id)
			.expect(200, done);
	});

	it('Get information about a scene: GET /api/authenticated/scenes/<id>', done => {
		request
			.get('/api/authenticated/scenes/' + sceneId)
			.expect(200, done);
	});

	it('Set attributes of the scene: PUT /api/authenticated/scenes/<id>', done => {
		request
			.put('/api/authenticated/scenes/' + sceneId)
			.send({ 'name': 'Test Scene' })
			.expect([
				{ 'success': { ['/scenes/' + sceneId + '/name']: 'Test Scene' } }
			])
			.expect(200, done);
	});

	it('Remove a scene: DELETE /api/authenticated/scenes/<id>', done => {
		request
			.delete('/api/authenticated/scenes/' + sceneId)
			.expect(200, done);
	});
});