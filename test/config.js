'use strict';

const common = require('./common');

const request = common.request;

describe('Configuration', () => {
	it('Create a new user: POST /api', done => {
		request
			.post('/api')
			.send({ 'devicetype': 'my_hue_app#test' })
			.expect(200, done);
	});

	it('Return the config: GET /api/authenticated/config', done => {
		request
			.get('/api/authenticated/config')
			.expect(200, done);
	});

	it('Update the config: PUT /api/authenticated/config', done => {
		request
			.put('/api/authenticated/config')
			.send({ 'name': 'New Bridge Name' })
			.expect([ 
				{ 'success': { '/config/name': 'New Bridge Name' } }
			])
			.expect(200, done);
	});

	it('Delete a user from the whitelist: DELETE /api/authenticated/config/whitelist/someuser', done => {
		request
			.delete('/api/authenticated/config/whitelist/someuser')
			.expect([
				{ 'success': '/config/whitelist/someuser deleted' }
			])
			.expect(200, done);
	});

	it('Return the full state of the bridge: GET /api/authenticated', done => {
		request
			.get('/api/authenticated')
			.expect(200, done);
	});

	it('Return upnp-compliant xml-description for the service: GET /description.xml', done => {
		request
			.get('/description.xml')
			.expect(200, done);
	});
});