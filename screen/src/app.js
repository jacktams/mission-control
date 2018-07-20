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

  const htmlToInject = pug.render('dist/src/views/info.pug', {
    ip: ip.address(),
    hostname: os.hostname()
  }).replace(/(\r\n|\n|\r)/gm,"");;
  const scriptToRun = "document.getElementsByTagName('BODY')[0].insertAdjacentHTML('afterbegin', '"+htmlToInject+"');";
  setTimeout(() => browser.runScript(scriptToRun), 800);

  ctx.body = browser.getURLs();
  return next;
});

router.get("/screen/urls/reload", (ctx, next) => {
  const currentURLs = browser.getURLs();
  browser.setURLs(currentURLs);
  ctx.body = "OK";
  return next;
});

router.get("/screen/cycle/on", (ctx, next) => {
  browser.startCycle();
  ctx.body = "OK";
  return next;
});

router.get("/screen/cycle/off", (ctx, next) => {
  browser.stopCycle();
  ctx.body = "OK";
  return next;
});

router.get("/screen/identify", (ctx, next) => {
  const htmlToInject = pug.render('dist/src/views/overlay.pug', {
    ip: ip.address(),
    hostname: os.hostname()
  }).replace(/(\r\n|\n|\r)/gm,"");;
  const scriptToRun = "document.getElementsByTagName('BODY')[0].insertAdjacentHTML('afterbegin', '"+htmlToInject+"'); setTimeout(function() { document.getElementsByClassName('mc-overlay')[0].remove(); }, 10000)";
  browser.runScript(scriptToRun);
  ctx.body = "OK";
  return next;
});

router.get("/screen/debug", (ctx, next) => {
  if( ctx.request.accepts('application/json') && !ctx.request.accepts('text/html') ){
    ctx.body = {
      ip: ip.address(),
      hostname: os.hostname(),
      ...browser.getCycleState()
    }
  } else {
    ctx.body = pug.render('dist/src/views/debug.pug', {
      ip: ip.address(),
      hostname: os.hostname(),
      ...browser.getCycleState()
    });
  }
  return next;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

if (process.env.NO_KIOSK)
  browser.setKiosk(false);

browser.setURLs([`http://localhost:${port}/screen/debug`]);
app.listen(port);
