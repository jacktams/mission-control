import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import browser from './browser';
import debugPage from './debug';

const app = new Koa();
const router = new Router();

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

router.get("/screen/cycle/on", () => {
  browser.startCycle();
});

router.get("/screen/cycle/off", () => {
  browser.stopCycle();
});

router.get("/screen/debug", debugPage(browser));

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3000;

browser.setURLs([`http://localhost:${port}/screen/debug`]);
app.listen(port);
