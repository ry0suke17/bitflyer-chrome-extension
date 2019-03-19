const vueParser = require('vue-parser');
const tsLintLoader = require('tslint-loader');

// この関数は <script lang="ts"></script> タグにも tslint-loader の機能を提供する。
// ref. https://github.com/wbuchwalter/tslint-loader/issues/105
module.exports = function(input, map) {
  const that = Object.assign({}, this, {
    async: () => {
      const cb = this.async();
      return function(err, _input, map) {
        cb(err, input, map);
      };
    },
  });
  if (/<script lang=(ts|"ts"|'ts')>([\s|\S]*)<\/script>/.test(input)) {
    const _input = vueParser.parse(input, 'script', { lang: ['ts', 'tsx'] });
    tsLintLoader.apply(that, [_input, map]);
  } else {
    tsLintLoader.apply(that, [input, map]);
  }
};
