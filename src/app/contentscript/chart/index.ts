import app from './components/app';

window.onload = () => {
  setTimeout(() => {
    // Vue で生成される DOM をマウントする {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="bf-extension-chart"></div>',
    );
    app.$mount('#bf-extension-chart');
    //
  }, 400);
};
