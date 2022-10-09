<template>
  <DxForm
    label-location="top"
    class="form-container"
  >
    <DxItem template="order-history">
      <DxLabel text="Каюты"/>
    </DxItem>

    <template #order-history="{ data }">
      <OrderHistory
        :product-id="chosenProductId"
      />
    </template>
  </DxForm>
</template>

<script>
 
import { DxForm, DxItem, DxLabel } from 'devextreme-vue/form';
import OrderHistory from './OrderHistory.vue';
 
export default {
  components: {
    DxForm, DxItem, DxLabel, OrderHistory,
  },
  props: {
    supplierId: {
      type: Number,
      default: null,
    },
  }, 
  data() {
    return {
      chosenProductId: null,
    };
  },
};
</script>
