export default (browser) => (ctx, next) => {
  ctx.body = `
    <h1>Debug</h1>
    <strong>URLS</strong> ${browser.getURLs()} </strong>
  `;
};