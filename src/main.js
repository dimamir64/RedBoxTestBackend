import 'devextreme/dist/css/dx.common.css';
//import 'devextreme/dist/css/dx.light.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import { createApp }  from "vue";
import router from "./router";

import App from "./App";
import appInfo from "./app-info";

const app = createApp(App);
app.use(require('axios'));
app.use(router);
app.config.globalProperties.$appInfo = appInfo;
app.mount('#app');
