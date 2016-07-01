'use strict';

var ActiveDirectory = require('activedirectory');
var _ = require('lodash');

function Plugin(config, stuff) {
  var self = Object.create(Plugin.prototype);
  self._config = config;
  self._logger = stuff.logger;
  self._logger.info('Active Directory plugin configuration:\n', config);
  return self;
}

Plugin.prototype.authenticate = function(user, password, callback) {
	var self = this;
	var username = user + '@' + this._config.domainSuffix;
	
	var connection = new ActiveDirectory(_.extend(this._config, { username: username, password: password }));
	connection.on('error', function(error) {
		self._logger.warn('Active Directory connection error. Error:', error);
	});

	connection.authenticate(username, password, function(err, authenticated) {
		if (err) {
			self._logger.warn('Active Directory authentication failed. Error code:', err.code + '.', 'Error:\n', err);
			return callback(err);
		}

		if (!authenticated) {
			var message = 'Active Directory authentication failed';
			self._logger.warn(message);
			return callback(new Error(message));
		}

		self._logger.info('Active Directory authentication succeeded')
		callback(null, [user]);
	});
};

module.exports = Plugin;