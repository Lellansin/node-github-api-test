'use strict';

const Koa = require('koa');
const config = require('config');
const bodyParser = require('koa-bodyparser');
const log4js = require('koa-log4');

const apis = require('./apis');
const logger = log4js.getLogger('cheese');

const app = new Koa();
const port = config.port || 3000;

//parse bodies
app.use(bodyParser());
//logging
app.use(log4js.koaLogger(log4js.getLogger("http"), { level: 'auto' }));

//setting rotuer
app.use(apis.routes());


//error handle
app.on('error', err => {
  if (err.status && err.status < 500) return;
  logger.error(err.stack);
});

//listen port
app.listen(port);
logger.info('Listening on port ' + config.port + ',' + 'god bless ' + config.name + '!');

module.exports = app;
