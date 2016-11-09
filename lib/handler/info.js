'use strict';

const moment = require('moment-timezone');

module.exports = bridge => {
	bridge.api.emitter.on('info.timezones', respond => respond.success(moment.tz.names()) );
};