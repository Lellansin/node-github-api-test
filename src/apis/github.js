'use strict';

var GitHubApi = require('github');

var github = new GitHubApi({
    debug: true,
    Promise
});

/*
 * access_token
 */
exports.getRepos = function * (token) {
  github.authenticate({ type: 'oauth', token });
  return github.repos.getAll({
    'affiliation': 'owner'
  });
};
