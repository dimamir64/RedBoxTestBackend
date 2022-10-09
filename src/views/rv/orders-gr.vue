<template>
  <div>
    <DxDataGrid
      id="gridContainer"
      :data-source="dataSource"
      key-expr="id"
      :show-borders="true"
      :word-wrap-enabled="true"
      :remote-operations="{ paging: true }"
      :ref="dataGridRef"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-hiding-enabled="true"
      column-resizing-mode="widget"
      :column-auto-width="true"
      :row-alternatin-enabled="true"
      :hover-state-enabled="true"
    >
      <DxSelection mode="single" />
      <DxPaging :page-size="100" :show-info="true" />
      <DxScrolling mode="infinite" />
      />
      <DxEditing :allow-adding="true" :allow-updating="true" mode="batch" />
      <DxGrouping :context-menu-enabled="true" expand-mode="rowClick" />
      <DxGroupPanel
        :visible="true"
        empty-panel-text="Перенесите за заголовок поле для группировки"
      />
      <DxColumnChooser :enabled="true" mode="select" />
      <DxSummary>
        <DxTotalItem column="id" summary-type="count" />
      </DxSummary>
    </DxDataGrid>
  </div>
</template>
<script>
//* eslint-disable import/no-unresolved */
//* eslint-disable import/no-webpack-loader-syntax */
import { locale, loadMessages, formatMessage } from "devextreme/localization";
import {
  DxDataGrid,
  DxPaging,
  DxSelection,
  DxScrolling,
  DxGrouping,
  DxGroupPanel,
  DxSummary,
  DxTotalItem,
} from "devextreme-vue/data-grid";
//import DxSelectBox from 'devextreme-vue/select-box';

import CustomStore from "devextreme/data/custom_store";
import "whatwg-fetch";
import axios from "axios";
import ruMessages from "../ru.json";
import service from "../data.js";
import auth from "../../auth";
//import data from './data.js';
function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}
//const cnt1=0;, PUT, DELETE, OPTIONS https://lx3074-8080.preview.csb.app "Authentication": 'Bearer ' + auth.getToken(),"Authorization": 'Bearer ' + auth.getToken(),application/json
/*const config = {
  headers: {
    Accept: "*.*",
    "Access-Control-Allow-Origin": "river.germes.rdbx.dev",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Authentication, X-Datetime",
    "Access-Control-Allow-Methods": "GET, POST",
    "Access-Control-Allow-Credentials": "true",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.167 YaBrowser/22.7.5.940 Yowser/2.5 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "X-Datetime": "2022-10-07 23:59:59",
    Origin: "river.germes.rdbx.dev",
  },
};*/
const store = new CustomStore({
  key: "id",
  load(loadOptions) {
    let params = "?";
    let prm = "";
    [
      "skip",
      "take",
      "requireTotalCount",
      "requireGroupCount",
      "sort",
      "filter",
      "totalSummary",
      "group",
      "groupSummary",
    ].forEach((i) => {
      if (i in loadOptions && isNotEmpty(loadOptions[i])) {
        console.log(i,loadOptions[i]);
        if (i == "skip") {
          prm = `page1=${JSON.stringify(loadOptions[i] / loadOptions["take"] + 1)}&${i}`;
        } else if (i == "take") prm = "limit";
        else prm = i;
        params += `${prm}=${JSON.stringify(loadOptions[i])}&`;
      }
    });
    //     'key' 36565b5083fc908e77f5d3331365525e00977ad7  &id=1753
    //       params += 'key=446e1ad0f5a04797dc30d7abee8458ea887e051f&cities=27,95&dateStartFrom=2022-8-22&sort=date-asc&type=river&dateEndTo=2023-11-01&';
    //params +=      "filter%5Bcommission_delta%5D=&filter%5Bcomment%5D=&filter%5Bsend_comment_to_director%5D=&filter%5Bignore_payment%5D=&filter%5Bignore_report%5D=&filter%5Bpayment_status_cid%5D=&filter%5B_total_discount_amount%5D=&filter%5B_total_payment%5D=&filter%5B_total_discount_percent%5D=&filter%5B_total_insurance%5D=&page=1&limit=100&skip=&take=&sort=";
    params = params.slice(0, -1);
    //https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders
    //https://booking.infoflot.com/API/riverlines/cruises?limit=10&sort=date-asc&cities=27,95&dateStartFrom=2022-8-22&offset=10&key=446e1ad0f5a04797dc30d7abee8458ea887e051f&id=1753
    //https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders?skip=0&take=12&requireTotalCount=true
    //config.headers.Authentication = 'Bearer ' + auth.getToken();
    //    config.headers.Authorization = 'Bearer ' + auth.getToken();
    //console.log(config);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${auth.getToken()}`;
    //console.log( "Authorization",  axios.defaults.headers.common["Authorization"]);
    //    return fetch(`https://river.germes.rdbx.dev/api/orders${params}`, {, config
    return axios
      .get(`https://river.germes.rdbx.dev/api/orders${params}`)
      .then((response) => {
        console.log("totalCount", response.data._meta.totalCount);
        return {
          data: response.data.data,
          totalCount: response.data._meta.totalCount,
          summary: 0, //data.summary,
          groupCount: 0, //data.groupCount,
        };
      })
      .catch(() => {
        throw new Error("Ошибка загрузки данных");
      });
  },
});
//    DxPager,  DxSelectBox,
const dataGridRef = "dataGrid";
export default {
  components: {
    DxDataGrid,
    DxScrolling,
    DxPaging,
    DxSelection,
    DxSummary,
    DxTotalItem,
    DxGrouping,
    DxGroupPanel,
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
      cnt: 121,
      dataGridRef,
      locales: service.getLocales(),
      editPopupOptions: { width: 700, height: 345 },
      amountEditorOptions: { format: "currency", showClearButton: true },
      selectBoxInputAttr: { id: "selectInput" },
    };
  },
  computed: {
    tcnt() {
      return 111;
    },
    dataGrid: function () {
      return this.$refs[dataGridRef].instance;
    },
  },
  methods: {
    getRecordCount() {
      const dataSource = this.dataGrid.getDataSource();
      return dataSource.items().length + 1;
    },
    gcnt() {
      return store.totalCount;
    },
    getLocale() {
      const storageLocale = sessionStorage.getItem("locale");
      return storageLocale != null ? storageLocale : "ru";
    },
    setLocale(savingLocale) {
      sessionStorage.setItem("locale", savingLocale);
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
    formatDate: new Intl.DateTimeFormat("ru-RU").format,
    contentReady(e) {
      if (!e.component.getSelectedRowKeys().length) {
        e.component.selectRowsByIndexes(0);
      }
    },
    selectionChanged(e) {
      e.component.collapseAll(-1);
      e.component.expandRow(e.currentSelectedRowKeys[0]);
    },
  },
};
</script>
<style scoped>
#gridContainer {
  height: 800px;
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

.option > label {
  margin-right: 10px;
}

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
}
</style>
