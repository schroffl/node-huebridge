'use strict';

const common = require('./common');

const request = common.request;

describe('Lights', () => {
	it('Return a list of all lights: GET /api/authenticated/lights', done => {
		request
			.get('/api/authenticated/lights')
			.expect(200, done);
	});

	it('Return all recently discovered lights: GET /api/authenticated/lights/new', done => {
		request
			.get('/api/authenticated/lights/new')
			.expect({ 'lastscan': 'none' })
			.expect(200, done);
	});

	it('Initiate a search for new lights', done => {
		request
			.post('/api/authenticated/lights')
			.expect({ })
			.expect(200, done);
	});

	it('Return information about a light: GET /api/authenticated/lights/1', done => {
		request
			.get('/api/authenticated/lights/1')
			.expect(200, done);
	});

	it('Rename a light: PUT /api/authenticated/lights/1', done => {
		request
			.put('/api/authenticated/lights/1')
			.send({ 'name': 'Test Light' })
			.expect([
				{ 'success': { '/lights/1/name': 'Test Light' } }
			])
			.expect(200, done);
	});

	it('Set the state of the light', done => {
		request
			.put('/api/authenticated/lights/1/state')
			.send({ 'on': true, 'hue': 65535 })
			.expect(200, done);
	});

	it('Remove a light: DELETE /api/authenticated/lights/1', done => {
		request
			.delete('/api/authenticated/lights/1')
			.expect(200, done);
	});
});