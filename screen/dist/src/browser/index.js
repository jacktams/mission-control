'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chromeLauncher = require('chrome-launcher');

var _chromeRemoteInterface = require('chrome-remote-interface');

var _chromeRemoteInterface2 = _interopRequireDefault(_chromeRemoteInterface);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadedURLs = [];
var chromeInstance = undefined;
var CYCLE_TIME_SECONDS = 5;
var TAB_CYCLE = false;
var currentTabIndex = 0;

var getURLs = function getURLs() {
  return loadedURLs;
};

var setURLs = function setURLs(urls) {
  loadedURLs = urls;
  if (!chromeInstance) launchChrome();

  openTabs().then(function (openTabList) {
    loadTabs(loadedURLs).catch(function (error) {
      console.error(error);
    }).then(function () {
      Promise.all(openTabList.map(function (id) {
        return closeTab(id);
      })).catch(function (error) {
        console.log('Error Closing ' + id);
      }).then(function () {
        _activateTab(0);
      });
    });
  });
};

var startCycle = function startCycle() {
  TAB_CYCLE = true;
  tabCycle();
};

var stopCycle = function stopCycle() {
  TAB_CYCLE = false;
};

var tabCycle = function tabCycle() {
  setTimeout(function () {
    currentTabIndex++;
    _activateTab(currentTabIndex);
    if (TAB_CYCLE) {
      tabCycle();
    }
  }, CYCLE_TIME_SECONDS * 1000);
};

var _activateTab = function _activateTab(index) {
  var _chromeInstance = chromeInstance,
      port = _chromeInstance.port;

  openTabs().then(function (openTabList) {
    currentTabIndex = index % openTabList.length;
    var id = openTabList[currentTabIndex];
    _chromeRemoteInterface2.default.Activate({ port: port, id: id });
  });
};

var openTabs = function openTabs() {
  var _chromeInstance2 = chromeInstance,
      port = _chromeInstance2.port;

  return _chromeRemoteInterface2.default.List({ port: port }).then(function (targets) {
    return targets.filter(function (target) {
      return target.type == 'page';
    }).map(function (target) {
      return target.id;
    });
  });
};

var closeTab = function closeTab(id) {
  var _chromeInstance3 = chromeInstance,
      port = _chromeInstance3.port;

  return _chromeRemoteInterface2.default.Close({ port: port, id: id });
};

var loadTabs = function loadTabs(urls) {
  var _chromeInstance4 = chromeInstance,
      port = _chromeInstance4.port;

  var urlLoad = urls.map(function (url) {
    return _chromeRemoteInterface2.default.New({ port: port, url: url });
  });
  return Promise.all(urlLoad);
};

var launchChrome = function launchChrome() {
  chromeInstance = (0, _chromeLauncher.launch)({
    chromeFlags: ['--kiosk']
  }).then(function (chrome) {
    chromeInstance = chrome;
    setURLs(loadedURLs);
    console.log('Chrome debugging port running on ' + chrome.port);
  });
};

exports.default = { setURLs: setURLs, getURLs: getURLs, startCycle: startCycle, stopCycle: stopCycle };