"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (browser) {
  return function (ctx, next) {
    ctx.body = "\n    <h1>Debug</h1>\n    <strong>URLS</strong> " + browser.getURLs() + " </strong>\n  ";
  };
};