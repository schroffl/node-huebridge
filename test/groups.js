'use strict';

const common = require('./common');

const request = common.request;

describe('Groups', () => {
	it('Return a list of all groups: GET /api/authenticated/groups', done => {
		request
			.get('/api/authenticated/groups')
			.expect(200, done);
	});

	it('Create a new group: POST /api/authenticated/groups', done => {
		request
			.post('/api/authenticated/groups')
			.send({ 'name': 'Test Group' })
			.expect(200, done);
	});

	it('Return information about a group: GET /api/authenticated/groups/1', done => {
		request
			.get('/api/authenticated/groups/1')
			.expect(200, done);
	});

	it('Set attributes of the group: PUT /api/authenticated/groups/1', done => {
		request
			.put('/api/authenticated/groups/1')
			.send({ 'name': 'New Group Name' })
			.expect([
				{ 'success': { '/groups/1/name': 'New Group Name' } }
			])
			.expect(200, done);
	});

	it('Set the state of the group: PUT /api/authenticated/groups/1/action', done => {
		request
			.put('/api/authenticated/groups/1')
			.send({ 'hue': 65535, 'bri': 128 })
			.expect(200, done);
	});

	it('Remove a group: DELETE /api/authenticated/groups/1', done => {
		request
			.delete('/api/authenticated/groups/1')
			.expect(200, done);
	});
});