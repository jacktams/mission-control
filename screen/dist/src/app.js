'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _koaBody = require('koa-body');

var _koaBody2 = _interopRequireDefault(_koaBody);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

var _debug = require('./debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
var router = new _koaRouter2.default();

app.use(async function (ctx, next) {
  var start = Date.now();
  await next();
  var ms = Date.now() - start;
  console.log('[' + ctx.method + ']  ' + ctx.url + ' - ' + ms);
});

router.get("/screen/url", function (ctx, next) {
  ctx.body = _browser2.default.getURLs();
  return next;
});

router.post("/screen/url", (0, _koaBody2.default)(), function (ctx, next) {
  console.log(ctx.request.body);
  _browser2.default.setURLs(ctx.request.body.urls);
  ctx.body = _browser2.default.getURLs();
  return next;
});

router.get("/screen/cycle/on", function () {
  _browser2.default.startCycle();
});

router.get("/screen/cycle/off", function () {
  _browser2.default.stopCycle();
});

router.get("/screen/debug", (0, _debug2.default)(_browser2.default));

app.use(router.routes()).use(router.allowedMethods());

var port = process.env.PORT || 3000;

_browser2.default.setURLs(['http://localhost:' + port + '/screen/debug']);
app.listen(port);