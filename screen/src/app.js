import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import Pug from 'koa-pug';
import ip from 'ip';
import os from 'os';
import browser from './browser';

const app = new Koa();
const router = new Router();
const pug = new Pug({
  app
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`[${ctx.method}]  ${ctx.url} - ${ms}`);
});

router.get("/screen/urls", (ctx, next) => {
  ctx.body = browser.getURLs();
  return next;
});

router.post("/screen/urls", koaBody(), (ctx, next) => {
  console.log(ctx.request.body);
  browser.setURLs(ctx.request.body.urls);
  ctx.body = browser.getURLs();
  return next;
});

router.get("/screen/urls/reload", (ctx, next) => {
  const currentURLs = browser.getURLs();
  browser.setURLs(currentURLs);
  return next;
});

router.get("/screen/cycle/on", () => {
  browser.startCycle();
});

router.get("/screen/cycle/off", () => {
  browser.stopCycle();
});

router.get("/screen/debug", (ctx, next) => {
  ctx.body = pug.render('dist/src/views/debug.pug', {
    ip: ip.address(), 
    hostname: os.hostname(),
    ...browser.getCycleState()
  });
  return next;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

if (process.env.NO_KIOSK) 
  browser.setKiosk(false);

browser.setURLs([`http://localhost:${port}/screen/debug`]);
app.listen(port);
