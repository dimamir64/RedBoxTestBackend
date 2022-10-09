<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <dx-form :form-data="formData" :disabled="loading">
      <dx-item
        data-field="email"
        editor-type="dxTextBox"
        :editor-options="{ stylingMode: 'filled', placeholder: 'Email', mode: 'email' }"
      >
        <dx-required-rule message="Email обязателен" />
        <dx-email-rule message="Email не корректен" />
        <dx-label :visible="false" />
      </dx-item>
      <dx-item
        data-field="login"
        editor-type="dxTextBox"
        :editor-options="{ stylingMode: 'filled',  placeholder: 'Логин', mode: 'text' }"
      >
        <dx-required-rule message="Логин обязателен" />
        <dx-label :visible="false" />
      </dx-item>
      <dx-item
        data-field='password'
        editor-type='dxTextBox'
        :editor-options="{ stylingMode: 'filled', placeholder: 'Пароль', mode: 'password' }"
      >
        <dx-required-rule message="Password обязателен" />
        <dx-label :visible="false" />
      </dx-item>
      <dx-item
        data-field="rememberMe"
        editor-type="dxCheckBox"
        :editor-options="{ text: 'Запомнить меня', elementAttr: { class: 'form-text' } }"
      >
        <dx-label :visible="false" />
      </dx-item>
      <dx-button-item>
        <dx-button-options
          width="100%"
          type="default"
          template="signInTemplate"
          :use-submit-behavior="true"
        >
        </dx-button-options>
      </dx-button-item>
      <dx-item>
        <template #default>
          <div class="link">
            <router-link to="/reset-password">Забыли пароль?</router-link>
          </div>
        </template>
      </dx-item>
      <dx-button-item>
        <dx-button-options
          text="Создать аккаунт"
          width="100%"
          :on-click="onCreateAccountClick"
        />
      </dx-button-item>
      <template #signInTemplate>
        <div>
          <span class="dx-button-text">
            <dx-load-indicator v-if="loading" width="24px" height="24px" :visible="true" />
            <span v-if="!loading">Войти</span>
          </span>
        </div>
      </template>
    </dx-form>
  </form>
</template>

<script>
import DxLoadIndicator from "devextreme-vue/load-indicator";
import DxForm, {
  DxItem,
  DxEmailRule,
  DxRequiredRule,
  DxLabel,
  DxButtonItem,
  DxButtonOptions
} from "devextreme-vue/form";
import notify from 'devextreme/ui/notify';

import auth from "../auth";

import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    //console.log("setup");
    const route = useRoute();
    const router = useRouter();

    const formData = reactive({
      email:"",
      login:"79000000000",
      password:""
    });
    const loading = ref(false);

    function onCreateAccountClick() {
      router.push("/create-account");
    }

    async function onSubmit() {
      const { email, login, password } = formData;
      loading.value = true;
      console.log("onSubmit",email, login, password);
      const result = await auth.logIn(email, login, password);
      //await result.json();
      setTimeout(()=>{console.log("1")
      console.log(auth.getToken());
      if (!auth.getToken()) {//result.isOk
        console.log("onSubmit !result.isOk",email, login, password)
        loading.value = false;
        notify("Ошибка авторизации", "error", 2000);
      } else {
        loading.value = false;
        notify("Успешная авторизация", "info", 2000);
        console.log("onSubmit isOk",result)
        router.push(route.query.redirect || "/home");
      }
      loading.value = false;},1000)
    }

    return {
      formData,
      loading,
      onCreateAccountClick,
      onSubmit
    };
  },
  components: {
    DxLoadIndicator,
    DxForm,
    DxEmailRule,
    DxRequiredRule,
    DxItem,
    DxLabel,
    DxButtonItem,
    DxButtonOptions
  }
};
</script>

<style lang="scss">
@import "../themes/generated/variables.base.scss";

.login-form {
  .link {
    text-align: center;
    font-size: 16px;
    font-style: normal;

    a {
      text-decoration: none;
    }
  }

  .form-text {
    margin: 10px 0;
    color: rgba($base-text-color, alpha($base-text-color) * 0.7);
  }
}
</style>
