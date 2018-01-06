import {launch} from 'chrome-launcher';
import ChromeRemote from 'chrome-remote-interface';

let loadedURLs = []; 
let chromeInstance = undefined;
const CYCLE_TIME_SECONDS = 20;
let TAB_CYCLE = false;
let currentTabIndex = 0;

const getURLs = () => loadedURLs;

const setURLs = (urls) => {
  loadedURLs = urls;
  if (!chromeInstance)
    launchChrome();
  
  openTabs().then(openTabList => {
    loadTabs(loadedURLs).catch((error) => {
      console.error(error);
    }).then(() => {
      Promise.all(openTabList.map(id => closeTab(id))).catch((error) => {
        console.log(`Error Closing ${id}`);
      }).then(() => {
        _activateTab(0);
      });
    });
  });
};

const startCycle = () => {
  TAB_CYCLE = true;
  tabCycle();
};

const stopCycle = () => {
  TAB_CYCLE=false;
};

const tabCycle = () => {
  setTimeout(() => {
    currentTabIndex++;
    _activateTab(currentTabIndex);
    if(TAB_CYCLE){
      tabCycle();
    }
  }, CYCLE_TIME_SECONDS*1000)
};

const _activateTab = (index) => {
  const { port } = chromeInstance;
  openTabs().then(openTabList => {
    currentTabIndex = index % openTabList.length;
    const id = openTabList[currentTabIndex];
    ChromeRemote.Activate({ port, id })
  });
};


const openTabs = () => {
  const { port } = chromeInstance;
  return ChromeRemote.List({ port })
    .then((targets) => {
      return targets.filter(target => target.type == 'page').map((target) => target.id);
    });
};

const closeTab = (id) => {
  const { port } = chromeInstance;
  return ChromeRemote.Close({ port, id });
};

const loadTabs = (urls) => {
  const { port } = chromeInstance;
  const urlLoad = urls.map((url) => ChromeRemote.New({ port, url }));
  return Promise.all(urlLoad);
};

const launchChrome = () => {
  chromeInstance = launch({
    chromeFlags: ['--kiosk']
  }).then(chrome => {
    chromeInstance = chrome;
    setURLs(loadedURLs)
    console.log(`Chrome debugging port running on ${chrome.port}`);
  });
};

export default { setURLs, getURLs, startCycle, stopCycle };
