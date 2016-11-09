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
  // 认证
  github.authenticate({ type: 'oauth', token });

  let branch = 'some-module-1.0.5';
  let owner = 'Lellansin';
  let repo = 'node-github-api-test';
  let path = 'package.json';
  let ref = `refs/heads/${branch}`;

  // 获取文件内容
  let file = yield github.repos.getContent({
    owner, repo, path, 
  });

  // 获取 master 的 sha
  let master = yield github.gitdata.getReference({ owner, repo, ref: 'heads/master' });

  // 根据 master 创建新的 branch
  let r1 = yield github.gitdata.createReference({
    owner, repo, ref, sha: master.object.sha,
  });


  if (!cb) {
    cb = function (content) {
      let data = JSON.parse(new Buffer(content, 'base64').toString());
      data.version = 'hello';
      return JSON.stringify(data, null, 2);
    };
  }

  // 修改文件
  let {sha} = file;
  let content = new Buffer(cb(file.content)).toString('base64');

  // 提交修改
  let r2 = yield github.repos.updateFile({
    owner, repo, branch, sha, path,
    message: 'test update package.json',
    content
  })

  // 提交 pr
  let r3 = yield github.pullRequests.create({
    owner, repo,
    title: `update ${branch} pull request`,
    head: branch,
    base: 'master',
    body: 'this is pr body...'
  });

  return r3;
};
