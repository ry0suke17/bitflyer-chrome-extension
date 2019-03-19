<template>
  <div id="bf-extension-menu" v-drag>
      <Menu />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Menu from './Menu.vue';

@Component({
  components: {
    Menu,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
// buefy の css に関しては #bf-extension-menu 以下の要素にしか当てないようにする。
#bf-extension-menu {
  @import '~bulma';
  @import '~buefy/src/scss/buefy';

  width: 500px;
  height: 508px;
  position: fixed;
  z-index: 1000;
  bottom: 10px;
  right: 10px;
  padding: 20px;
  background-color: $grey-dark;
}
</style>