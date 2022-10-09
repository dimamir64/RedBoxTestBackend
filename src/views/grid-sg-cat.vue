<template>
  <DxDataGrid id="gridContainer" :data-source="dataSource" key-expr="id" :show-borders="true" :word-wrap-enabled="true"
    :remote-operations="true" :allow-column-reordering="true" :allow-column-resizing="true"
    :row-alternatin-enabled="true" :hover-state-enabled="true" data-row-template="dataRowTemplate">
    <DxPaging :page-size="20" />
    <DxScrolling
      mode="virtual"
      row-rendering-mode="virtual"
    />
    <DxHeaderFilter :visible="true" :allow-search="true" />
    <DxColumn :allow-sorting="false" data-field="shipPhoto" caption="" />
    <DxColumn data-field="shipName" data-type="string" caption="Теплоход" />
    <DxColumn data-field="dateStart" data-type="date" caption="Начало" />
    <DxColumn data-field="dateEnd" data-type="date" caption="Завершение" />
    <DxColumn data-field="days" data-type="number" format="fixedPoint" caption="Дней" />
    <DxColumn data-field="nights" data-type="number" format="fixedPoint" caption="Ночей" />
    <DxColumn data-field="minPrice" data-type="number" format="fixedPoint" caption="Мин Цена" />
    <DxColumn data-field="is_wow" data-type="bool" caption="" :visible="false" />
    <DxColumn data-field="id" data-type="number" caption="" :visible="false" />
    <DxColumn data-field="routeShort" data-type="text" caption="" :visible="false" />
    <DxColumn data-field="route" data-type="text" caption="" :visible="false" />
    <template #dataRowTemplate="{ data: rowInfo }">
      <tr class="main-row">
        <td rowspan="3"><img :src="rowInfo.data.shipPhoto"></td>
        <td>{{ rowInfo.data.shipName }} </td>
        <td colspan="1">{{ formatDate(new Date(rowInfo.data.dateStart)) }} </td>
        <td colspan="1">{{ formatDate(new Date(rowInfo.data.dateEnd)) }} </td>
        <td style="text-align: right;">{{ rowInfo.data.days }}</td>
        <td style="text-align: right;">{{ rowInfo.data.nights }} </td>
        <td style="text-align: right;">{{ rowInfo.data.minPrice }}</td>
      </tr>
      <tr class="">
        <td colspan="6">
          <div> <strong> {{ rowInfo.data.routeShort }} </strong></div>
        </td>
      </tr>
      <tr class="notes-row">
        <td colspan="6">
          <div> {{ rowInfo.data.is_wow }} {{ rowInfo.data.route }}</div>
        </td>
      </tr>
    </template>

  </DxDataGrid>
</template>
<script>
//* eslint-disable import/no-unresolved */
//* eslint-disable import/no-webpack-loader-syntax */
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import { DxDataGrid, DxColumn, DxHeaderFilter, DxPaging, DxScrolling } from 'devextreme-vue/data-grid';
//import DxSelectBox from 'devextreme-vue/select-box';

import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import ruMessages from './ru.json';
import service from './data.js';
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== '';
}
const store = new CustomStore({
  key: 'id',
  load(loadOptions) {
    let params = '?';
    let prm = '';
    [
      'skip',
      'take',
      'requireTotalCount',
      'requireGroupCount',
      'sort',
      'filter',
      'totalSummary',
      'group',
      'groupSummary',
    ].forEach((i) => {
      if (i in loadOptions && isNotEmpty(loadOptions[i])) {
        if (i=="skip") prm='offset'
        else if (i=="take") prm='limit'
        else prm=i;
         params += `${prm}=${JSON.stringify(loadOptions[i])}&`; }
    });
    params += 'key=446e1ad0f5a04797dc30d7abee8458ea887e051f&id=1753&cities=27,95&dateStartFrom=2022-8-22&sort=date-asc&';
    params = params.slice(0, -1);
    return fetch(`https://booking.infoflot.com/API/riverlines/cruises${params}`)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
        totalCount: data.count,
        summary: 0,//data.summary,
        groupCount: 0 //data.groupCount,
      }))
      .catch(() => { throw new Error('Ошибка загрузки данных'); });
  },
});
export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxScrolling,
    DxPaging,
    DxHeaderFilter,
  },
  created() {
    this.locale = this.getLocale();
    this.initMessages();
    locale(this.locale);
  },
  data() {
    return {
      dataSource: store,
      locale: null,
      locales: service.getLocales(),
      editPopupOptions: { width: 700, height: 345 },
      amountEditorOptions: { format: 'currency', showClearButton: true },
      selectBoxInputAttr: { id: 'selectInput' },
    };
  },
  methods: {
    getLocale() {
      const storageLocale = sessionStorage.getItem('locale');
      return storageLocale != null ? storageLocale : 'ru';
    },
    setLocale(savingLocale) {
      sessionStorage.setItem('locale', savingLocale);
    },
    initMessages() {
      loadMessages(ruMessages);
      loadMessages(service.getDictionary());
    },
    changeLocale(e) {
      this.setLocale(e.value);
      document.location.reload();
    },
    formatMessage,
    formatDate: new Intl.DateTimeFormat('ru-RU').format,
  },
};
</script>
<style scoped>
#gridContainer {
  height: 400px;
  width: auto;
}

.dx-row img {
  flex: 30%;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30%;
  width: 100%;
  min-width: 30%;
}

#gridContainer tr.main-row td:not(:first-child) {
  height: 21px;
}

#gridContainer tr.notes-row {
  white-space: normal;
  vertical-align: top;
}

#gridContainer tr.notes-row td {
  height: 70px;
  color: rgb(20, 20, 20);
}

.dark #gridContainer tr.notes-row td {
  color: #777;
}

#gridContainer tbody.dx-state-hover {
  background-color: #ebebeb;
}

.dark #gridContainer tbody.dx-state-hover {
  background-color: #484848;
}

#gridContainer tbody.dx-state-hover tr.main-row td {
  color: #000;
}

.dark #gridContainer tbody.dx-state-hover tr.main-row td {
  color: #ccc;
}

#gridContainer tbody.dx-state-hover tr.notes-row td {
  color: #888;
}

.options {
  padding: 2px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 2px;
}

.option {
  margin-top: 10px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option>label {
  margin-right: 10px;
}

.option>.dx-selectbox {
  display: inline-block;
  vertical-align: middle;
}
</style>