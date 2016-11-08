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

/*
 * access_token
 */
exports.getPackageConfig = function * (token) {
  github.authenticate({ type: 'oauth', token });
  return github.repos.getContent({
    owner: 'Lellansin',
    repo: 'node-github-api-test',
    path: 'package.json',
  });
};

/*
 * access_token
 */
exports.updatePR = function * (token, cb) {
  github.authenticate({ type: 'oauth', token });

  let branch = 'some-module-1.0.0';
  let owner = 'Lellansin';
  let repo = 'node-github-api-test';
  let path = 'package.json';

  let r1 = yield github.repos.addProtectedBranchRequiredStatusChecksContexts({
    owner, repo, branch,
    body: ['continuous-integration/travis-ci', 'continuous-integration/jenkins']
  });
  console.log('r1', r1);

  let file = yield github.repos.getContent({
    owner, repo, path
  });

  if (!cb) {
    cb = function (content) {
      let data = JSON.parse(new Buffer(content, 'base64').toString());
      data.version = 'hello';
      return JSON.stringify(data);
    };
  }

  let {sha, json} = file;
  let content = new Buffer(cb(json)).toString('base64');

  let r2 = yield github.repos.updateFile({
    owner, repo, branch, sha, path,
    message: 'test update package.json',
    content
  })

  console.log('r2', r2);

  let r3 = yield github.pullRequests.create({
    owner, repo,
    title: `update ${branch} pull request`,
    head: branch,
    base: 'master',
    body: 'this is pr body...'
  });

  return r3;
};
