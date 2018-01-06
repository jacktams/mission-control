import ip from 'ip';

const getIp = () => {
  return ip.address();
};

export default (browser) => (ctx, next) => {
  ctx.body = {
    urls: browser.getURLs(), 
    cycle: browser.getCycleState(),
    ip: getIp()
  }
  return next;
};