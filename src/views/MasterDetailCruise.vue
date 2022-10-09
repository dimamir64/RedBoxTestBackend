<template>
  <DxTabPanel>
    <DxItem
      title="Описание круиза"
      template="descr-tab"
    />
    <template #descr-tab>
      <DescrTab
        :cruise-id="masterDetailData.key"
      />
    </template>
    <DxItem
      title="Категории кают"
      template="cat-tab"
    />
    <template #cat-tab>
      <CatTab
        :cruise-id="masterDetailData.key"
      />
    </template>
  </DxTabPanel>
</template>

<script>
import { DxTabPanel, DxItem } from 'devextreme-vue/tab-panel';

import CatTab from './CatTab.vue';
import DescrTab from './DescrTab.vue';

export default {
  components: {
    DxTabPanel, DxItem, CatTab, DescrTab,
  },
  props: {
    masterDetailData: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
