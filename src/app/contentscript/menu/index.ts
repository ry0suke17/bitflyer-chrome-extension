import app from './components/app';

// backgroud.js からのエラーメッセージをログに残す {
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.contentScriptQuery === 'error') {
    console.error(request.error);
    sendResponse(`sent error message. err: ${request.error}`);
  }
});
// }

window.onload = () => {
  setTimeout(() => {
    // font-awesome の css 読み込み {
    document.head.insertAdjacentHTML(
      'beforeend',
      `<link rel="stylesheet"
             href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
             integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
             crossorigin="anonymous">`,
    );
    // }

    // Vue で生成される DOM をマウントする {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="bf-extension-menu"></div>',
    );
    app.$mount('#bf-extension-menu');
    //

    // 各セクションの表示を調整する {
    const marketHistory = document.querySelector('section.market-history');
    if (marketHistory) {
      marketHistory.setAttribute('style', 'display: none');
    }
    const order = document.querySelector('section.order');
    if (order) {
      order.setAttribute('style', 'width: 10%');
    }
    const board = document.querySelector('section.board');
    if (board) {
      board.setAttribute('style', 'width: 15%');
      // board.setAttribute('style', 'display: none');
    }
    const mainTop = document.querySelector('.main--top');
    if (mainTop) {
      // mainTop.setAttribute('style', 'height: 80%; max-height: 80%');
    }
    const mainBottom = document.querySelector('.main--bottom');
    if (mainBottom) {
      // mainBottom.setAttribute('style', 'height: 20%; max-height: 20%');
    }
    // }

    console.log('finished setup for lightning');
  }, 400);
};
