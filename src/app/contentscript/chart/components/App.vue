<template>
  <div id="bf-extension-chart">
      <Chart />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Chart from './Chart.vue';

@Component({
  components: {
    Chart,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
// buefy の css に関しては #bf-extension-menu 以下の要素にしか当てないようにする。
#bf-extension-chart {
  @import '~bulma';
  @import '~buefy/src/scss/buefy';
}
</style>