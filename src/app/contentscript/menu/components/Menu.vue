<template>
    <section>
        <div class="columns is-mobile">
            <div class="column is-12">
                <b-message :type="modeType" has-icon>
                    現在は <strong>{{conditionTypeText}}</strong> の <strong>{{sideText}}モード</strong> になっています。
                </b-message>
            </div>
        </div>

        <div class="columns is-mobile">
            <div class="column is-12">
                <div class="field">
                    <label class="label" style="color:white">数量</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="数量" v-model="size">
                    </div>
                    <p class="help">最小の数量は 0.01 です。</p>
                </div>
            </div>
        </div>

        <div class="columns is-mobile">
            <div class="column is-6">
                <a class="button is-large is-fullwidth is-danger" @click="stopLimitSell">逆指値 売り</a>
            </div>
            <div class="column is-6">
                <a class="button is-large is-fullwidth is-success" @click="stopLimitBuy">逆指値 買い</a>
            </div>
        </div>        

        <div class="columns is-mobile">
            <div class="column is-6">
                <a class="button is-large is-fullwidth is-danger" @click="limitSell">指値 売り</a>
            </div>
            <div class="column is-6">
                <a class="button is-large is-fullwidth is-success" @click="limitBuy">指値 買い</a>
            </div>
        </div>        

        <div class="columns is-mobile">
            <div class="column is-12">
                <a class="button is-large is-fullwidth" @click="allCancel">全ての注文をキャンセル</a>
            </div>
        </div>
    </section>
</template>

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

<script lang="ts">
import { sendMessageCancelAllChildOrders } from '@contentscript/chrome/message';
import { errorMessage } from '@infrastructure/repository/bitflyer/api/types/apiError';
import ChromeStorage from '@infrastructure/repository/storage/chrome/index';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Menu extends Vue {
  private sideText = '';
  private conditionTypeText = '';
  private modeType = '';
  private size = '0';

  private async mounted() {
    this.updateMode();
    this.size = (await ChromeStorage.getSize()) || '';
  }

  @Watch('size')
  private async onChangeSize(val: string, oldVal: string) {
    if (val !== oldVal) {
      ChromeStorage.setSize(val);
    }
  }

  private async limitSell() {
    await ChromeStorage.setSide('SELL');
    await ChromeStorage.setConditionType('LIMIT');
    await this.updateMode();
  }

  private async limitBuy() {
    await ChromeStorage.setSide('BUY');
    await ChromeStorage.setConditionType('LIMIT');
    await this.updateMode();
  }

  private async stopLimitSell() {
    await ChromeStorage.setSide('SELL');
    await ChromeStorage.setConditionType('STOP_LIMIT');
    await this.updateMode();
  }

  private async stopLimitBuy() {
    await ChromeStorage.setSide('BUY');
    await ChromeStorage.setConditionType('STOP_LIMIT');
    await this.updateMode();
  }

  private allCancel() {
    sendMessageCancelAllChildOrders({ product_code: 'FX_BTC_JPY' })
      .then(resp => {
        if (resp.failed) {
          this.displayError(errorMessage(resp.failed.apiError));
        }
      })
      .catch(err => this.displayError(err));
  }

  private async updateMode() {
    const side = (await ChromeStorage.getSide()) || 'BUY';
    const conditionType = (await ChromeStorage.getConditionType()) || 'LIMIT';

    switch (side) {
      case 'SELL':
        this.sideText = '売り';
        this.modeType = 'is-danger';
        break;
      case 'BUY':
        this.sideText = '買い';
        this.modeType = 'is-success';
        break;
      default:
        console.error('invalid text for side.');
    }

    switch (conditionType) {
      case 'LIMIT':
        this.conditionTypeText = '指値';
        break;
      case 'STOP_LIMIT':
        this.conditionTypeText = '逆指値';
        break;
      default:
        console.error('invalid text for condition type.');
    }
  }

  private displayError(message: string) {
    // TODO: 別モジュールで汎用的に利用できるようにする
    this.$snackbar.open({
      duration: 5000,
      message: `エラー: ${message}`,
      actionText: '閉じる',
      type: 'is-danger',
      container: '#bf-extension-chart',
    });

    console.error(message);
  }
}
</script>