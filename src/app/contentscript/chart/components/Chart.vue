<template>
</template>

<script lang="ts">
import {
  sendMessageSendChildOrder,
  sendMessageSendParentOrder,
} from '@contentscript/chrome/message';
import ChromeStorage from '@infrastructure/repository/storage/chrome/index';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Chart extends Vue {
  private mounted() {
    try {
      const canvas = document.querySelectorAll('.kuromaty-chart canvas')[2];
      canvas.addEventListener('contextmenu', this.chartEventListener);
    } catch (err) {
      console.error(`failed add event listener. err: ${err}`);
    }
  }

  private beforeDestroy() {
    try {
      const canvas = document.querySelectorAll('.kuromaty-chart canvas')[2];
      canvas.removeEventListener('contextmenu', this.chartEventListener);
    } catch (err) {
      console.error(`failed remove event listener. err: ${err}`);
    }
  }

  /**
   * chartEventListener はチャートのイベントリスナーを表す。
   * @param e イベントを表す。
   */
  private chartEventListener(e: Event) {
    // シフトキーが押されているか確認したいのでMouseEventにする {
    const mouseEvent = e as MouseEvent;
    // }

    // シフトが押されていなかったら終了 {
    if (!mouseEvent.metaKey) {
      return;
    }
    // }

    // メニューを取得する {
    const chartMenu = document.querySelector('.kuromaty-context-menu');
    if (!chartMenu) {
      console.error('failed to get chart menu elm.');
      return;
    }
    // }

    // 注文する {
    try {
      const pricdeButton = chartMenu.querySelectorAll('button span')[0];
      if (pricdeButton.textContent) {
        this.sendOrder(parseInt(pricdeButton.textContent, 10));
      } else {
        throw new Error('failed to get price.');
      }
    } catch (err) {
      console.error(err);
    }
    // }

    // メニューを消す {
    setTimeout(() => document.body.dispatchEvent(new Event('click')), 10);
    // }
  }

  /**
   * sendOrder は新規の注文をする。
   * @param price クリックされた価格を取得する
   */
  private async sendOrder(price: number) {
    const side = (await ChromeStorage.getSide()) || 'BUY';
    const conditionType = (await ChromeStorage.getConditionType()) || 'LIMIT';
    const sizeText = (await ChromeStorage.getSize()) || '';
    const size = parseFloat(sizeText);

    // TODO: 値幅は入力フォームから指定できるようにする
    const range = 100;

    if (isNaN(size)) {
      this.displayError('数量が正しくありません。');
      return;
    }

    switch (conditionType) {
      case 'LIMIT':
        sendMessageSendChildOrder({
          product_code: 'FX_BTC_JPY',
          child_order_type: conditionType,
          side,
          price,
          size,
        }).catch(console.error);
        break;
      case 'STOP_LIMIT':
        // トリガー価格を計算する {
        const triggerPrice = side === 'BUY' ? price - range : price + range;
        // }
        sendMessageSendParentOrder({
          order_method: 'SIMPLE',
          parameters: [
            {
              product_code: 'FX_BTC_JPY',
              condition_type: conditionType,
              side,
              price,
              size: 0.01,
              trigger_price: triggerPrice,
            },
          ],
        }).catch(console.error);
        break;
    }
  }

  private displayError(message: string) {
    // TODO: 別モジュールで汎用的に利用できるようにする
    this.$snackbar.open({
      duration: 5000,
      message: `エラー: ${message}`,
      actionText: '閉じる',
      type: 'is-danger',
      container: '#bf-extension-menu',
    });

    console.error(message);
  }
}
</script>

