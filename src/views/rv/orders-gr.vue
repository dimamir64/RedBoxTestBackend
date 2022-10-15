<template>
  <div>
    <div class="dx-fieldset" :col-count="6">
      <div class="dx-field">
        <div class="dx-field-label" style="width:550px" >
          <DxLookup :items="items" :display-expr="getDisplayExpr" placeholder="Выберете endpoint" 
            @value-changed="setSelectedValue">
            value-expr="name"
            <DxDropDownOptions :show-title="false" />
          </DxLookup>
        </div>
        <div class="dx-field-label" style="margin-left:25px">
          <DxButton :width="150" text="Следующий" type="normal" styling-mode="contained" @click="refresh" />
        </div>
        <div class="dx-field-label">
          <DxButton :width="150" text="Обновить" type="normal" styling-mode="contained" @click="refresh" />
        </div>
      </div>
    </div>
    <DxForm id="form" :form-data="formData" :min-col-width="50" :col-count="6">

    </DxForm>
    <div> {{reqtext}} {{cnt}}</div>
    <div v-if="refr">
      <div class="selected">
        <DxDataGrid id="gridContainer" :data-source="dataSource" key-expr="id" :show-borders="true"
          :remote-operations="{ paging: true }" :ref="dataGridRef" :allow-column-reordering="true"
          :allow-column-resizing="true" :column-hiding-enabled="true" column-resizing-mode="widget"
          :word-wrap-enabled="true" :column-auto-width="true" :row-alternatin-enabled="true"
          :hover-state-enabled="true">
          <DxLoadPanel :enabled="true" />
          <DxScrolling mode="infinite" />
          <DxSorting mode="multiple" />
          <DxEditing :allow-adding="true" :allow-updating="true" mode="batch" />
          <DxGroupPanel :visible="true" />
          <DxGrouping :auto-expand-all="true" />
          <DxPaging :page-size="200" />
          <DxSearchPanel :visible="true" />
          <DxColumnChooser :enabled="true" mode="select" />
        </DxDataGrid>
      </div>
    </div>
  </div>
</template> 
<script>
/*  :label-mode="floating" :label-location="top"
          <form class="login-form" @submit.prevent="onSubmit">
            <dx-form :form-data="formData" :disabled="loading">
              <dx-button-item>
                <dx-button-options text="Обновить" width="10%" :on-click="onRefresh" />
              </dx-button-item>
            </dx-form>
          </form>
*/
//* eslint-disable import/no-unresolved */
//* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable */
import { locale, loadMessages, formatMessage } from "devextreme/localization";
import DxButton from 'devextreme-vue/button';
import {
  DxDataGrid,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxGrouping,
  DxGroupPanel,
  DxSearchPanel, DxEditing, DxPaging, DxColumnChooser
} from "devextreme-vue/data-grid";
import { DxLookup, DxDropDownOptions } from 'devextreme-vue/lookup';
/*import DxForm, {
 
} from "devextreme-vue/form";*/
//import DxSelectBox from 'devextreme-vue/select-box';
import {
  DxForm, DxItem, DxSelectBox, DxButtonItem,
  DxButtonOptions

} from 'devextreme-vue/form';

import CustomStore from "devextreme/data/custom_store";
import "whatwg-fetch";
import axios from "axios";
import ruMessages from "../ru.json";
import service from "../data.js";
import auth from "../../auth";
import Serv from "../../endpoints";
//import data from './data.js';
//console.log("endpoints",endpoints);


function isNotEmpty(value) {
  return value !== undefined && value !== null && value !== "";
}
//const cnt1=0; https://lx3074-8080.preview.csb.app "Authentication": 'Bearer ' + auth.getToken(),"Authorization": 'Bearer ' + auth.getToken(),application/json
/*const config = {
  headers: {
    Accept: "*.*",
    "Access-Control-Allow-Origin": "river.germes.rdbx.dev",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Authentication, X-Datetime",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Credentials": "true",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.167 YaBrowser/22.7.5.940 Yowser/2.5 Safari/537.36",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "X-Datetime": "2022-10-07 23:59:59",
    Origin: "river.germes.rdbx.dev",
  },
};*/
const url = 'https://river.germes.rdbx.dev/api/';
let ep = 'orders'
//const store = 

function newStore() {
  return new CustomStore({
    key: "id",
    load(loadOptions) {
      let params = "?";
      let prm = "";
      ["skip", "take", "requireTotalCount", "requireGroupCount", "sort", "filter", "totalSummary", "group", "groupSummary",
      ].forEach((i) => {
        //console.log(i, loadOptions[i]);
        if (i in loadOptions && isNotEmpty(loadOptions[i])) {
          if (i == "skip") { prm = `page=${JSON.stringify(loadOptions[i] / loadOptions["take"] + 1)}&${"pp1"}`; } else if (i == "take") prm = "limit";
          else prm = i;
          params += `${prm}=${JSON.stringify(loadOptions[i])}&`;
        }
      });
      // params +=      "&extend=order_cabins,order_payments,contractor,cabinNumbers";
      params = params.slice(0, -1);
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.getToken()}`;
      //console.log( "Authorization",  axios.defaults.headers.common["Authorization"]);
      return axios
        .get(`${url}${ep}${params}`)
        .then((response) => {
          let cnt = 0;
          //          console.log("response", response);
          if (response.data?._meta?.totalCount) {
            //          console.log("totalCount", response.data._meta.totalCount);
            cnt = response.data._meta.totalCount;
            console.log("cnt", cnt);
          }
          return {
            data: response.data.data,
            totalCount: cnt,
            summary: 0, //data.summary,
            groupCount: 0, //data.groupCount,
          };
        })
        .catch((error) => {
          console.log("error", error);
          throw new Error("Ошибка загрузки данных");
        });
    },
  })
}
//    DxPager,  DxSelectBox,useRoute,
const dataGridRef = "dataGrid";
//import { useRouter } from 'vue-router';
const reqparams = {
  ep0: "",
  id0: "",
  ep1: "",
  id1: "",
  ep2: "",
  id2: "",
}
export default {
  setup() {
  },
  components: {
    DxDataGrid, DxLookup, DxDropDownOptions,
    DxScrolling, DxSorting, DxLoadPanel, DxGrouping,
    DxGroupPanel, DxButton, DxForm, DxItem, DxSelectBox,
    DxSearchPanel, DxEditing, DxPaging, DxColumnChooser,
    DxButtonItem,
    DxButtonOptions
  },
  created() {
    this.locale = this.getLocale();
    this.initMessages();
    locale(this.locale);
  },
  data() {
    const endp = Serv.getendpoints();
    return {
      dataSource: newStore(),
      formData: reqparams,
      locale: null,
      dataGridRef,
      dataGridRefName: 'dataGrid',
      locales: service.getLocales(),
      editPopupOptions: { width: 700, height: 345 },
      amountEditorOptions: { format: "currency", showClearButton: true },
      selectBoxInputAttr: { id: "selectInput" },
      items: endp,
      selectedValue: null,
      refr: null
    };
  },
  computed: {
    tcnt() {
      return 111;
    },
    reqtext() {
      ep = '';
      if (this.formData.ep0) ep += this.formData.ep0;
      if (this.formData.id0) ep += '/' + this.formData.id0;
      if (this.formData.ep1) ep += '/' + this.formData.ep1;
      if (this.formData.id1) ep += '/' + this.formData.id1;
      if (this.formData.ep2) ep += '/' + this.formData.ep2;
      if (this.formData.id2) ep += '/' + this.formData.id2;
      //console.log('ep,ep1', ep, `${this.formData.ep0}.${this.formData.id0}.${this.formData.ep1}.${this.formData.id1}.${this.formData.ep2}`)
      // ep = `${this.formData.ep0}${this.formData.id0}${this.formData.ep1}${this.formData.id1}${this.formData.ep2}`;
      return ep;
    },
    cnt() {
      this.totalCount;
    },
    dataGrid: function () {
      return this.$refs[dataGridRef].instance;
    },
  },
  methods: {
    getDisplayExpr(item) {
      return item ? `${item.name} (${item.descr})` : '';
    },
    setSelectedValue(e) {
      //      console.log('ep1', ep)
      this.formData.ep0 = e.value.ep0;
      this.formData.id0 = e.value.id0;
      this.formData.ep1 = e.value.ep1;
      this.formData.id1 = e.value.id1;
      this.formData.ep2 = e.value.ep2;
      this.formData.id2 = e.value.id2;

      this.selectedValue = e.value;
      ep = e.value.name;
      this.refr = false;
      this.$nextTick(() => {
        this.refr = true;
      });

      //  console.log('ep', ep)
    },
    refresh() {
      console.log('formData', this.formData)
      this.refr = false;
      this.$nextTick(() => {
        this.refr = true;
      });
    },
    getRecordCount() {
      const dataSource = this.dataGrid.getDataSource();
      return dataSource.items().length + 1;
    },
    gcnt() {
      return 0; //store.totalCount;
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
/*  @import "../../layouts/dx.light.css"; */

#gridContainer {
  height: auto;
  max-height: 700px;
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
  height: 14px;
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

.first-group,
.second-group {
  padding: 10px;
}

.second-group {
  background-color: rgba(191, 191, 191, 0.15);
}

#gridContainer .dx-datagrid .dx-row>td {
  padding: 2px 2px;
  font-size: 13px;
  line-height: 14px;
}

#gridContainer .dx-datagrid-checkbox-size .dx-checkbox-icon {
  height: 12px;
  width: 12px;
}

#gridContainer .dx-editor-cell.dx-editor-inline-block:not(.dx-command-select)::before {
  padding-top: 2px;
  padding-bottom: 2px;
}

.dx-theme-generic .dx-fieldset,
.dx-theme-material .dx-fieldset {
  width: 40%;
  float: left;
}

.dx-field>.dx-lookup {
  height: auto;
  flex: 1;
}
</style>
