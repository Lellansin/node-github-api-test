'use strict';

const qs = require('querystring');
const request = require('request-promise');
const lodash = require('async')
const postController = require('./post');
const router = require('koa-router')();


const client_id = '4412323b1dde39d1c63e'; // public
const client_secret = '5a49c37aa146f09394c8a3f41e8367f857e197dc'; // server only
const accept = 'json'

const github = require('./github')

router
  .get('/v1/posts', postController.fetch)
  .get('/', function * () {
    this.body = `<html>
      <head>
      </head>
      <body>
        <p>
          嗨, 你好!
        </p>
        <p>
          我们准备来接 GitHub API. Ready?
          <a href="https://github.com/login/oauth/authorize?scope=user%20repo&client_id=${client_id}">点击</a> 跳转授权!</a>
        </p>
        <p>
          如果跳失败, 请检查你自己的 <a href="/v3/oauth/#web-application-flow">Client ID</a>!
        </p>
      </body>
    </html>`;
  })
  .get('/callback', function * () {
    // 获得用户验证 code
    let { code } = this.query;
    let res = yield request.post('https://github.com/login/oauth/access_token')
      .form({ 
        client_id,
        client_secret,
        code,
        accept
      })
    let pri = qs.parse(res);
    let { access_token } = pri;


    // get Repos list
    // let result = yield github.getRepos(access_token);


    // get package.json
    // let result = yield github.getPackageConfig(access_token);
    // result = new Buffer(result.content, 'base64').toString();

    // update PR
    let result = yield github.updatePR(access_token);
    
    this.headers['Content-type'] = 'application/json';
    this.body = result;
  });

module.exports = router;
