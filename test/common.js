'use strict';

const HueBridge = require('../lib/bridge');

const bridge = new HueBridge();
const request = require('supertest')(bridge.api.router);

bridge.config.addUser('authenticated');
bridge.config.addUser('someuser');

bridge.lights.create();

module.exports.request = request;
module.exports.bridge = bridge;