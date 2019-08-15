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

		if(self._config.groupName) {	
			connection.getGroupMembershipForUser(username, function(err, userGroups){
				if (err) {
					self._logger.warn('Active Directory group check failed. Error code:', err.code + '.', 'Error:\n', err);
					return callback(err);
				}

				// cast groupName to an array of groupname if a single one is provided.
				var requestedGroups = Array.isArray(self._config.groupName) ? self._config.groupName : [self._config.groupName];
				
				// figure out which of the required groups exist on the user, if any.
				var matchingGroups = userGroups.reduce(function getGroupNames(acc, group){
					return acc.concat(requestedGroups.filter(function(requestedGroup){
						return (group.cn === requestedGroup) || (group.dn === requestedGroup)
					}));
				}, []);
				if(matchingGroups.length > 0){
					self._logger.info('Active Directory authentication succeeded and user is member of group(s) ' + matchingGroups.join(', '))
					callback(null, matchingGroups.concat(user));
				} else {
					var message = 'User ' + user + ' is not member of group(s): ' + requestedGroups.join(',');
					self._logger.warn(message);
					return callback(new Error(message))
				}
			})
		} else {
			self._logger.info('Active Directory authentication succeeded')
			callback(null, [user]);
		};
	});

};

module.exports = Plugin;
