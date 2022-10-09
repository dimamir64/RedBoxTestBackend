<template>
  <div>
    <h2 class="content-block">Профиль пользователя</h2>

    <div class="content-block dx-card responsive-paddings">
      <div class="form-avatar">
        <img :src="imageSrc" />
      </div>
      <span>{{ formData.Notes }}</span>
    </div>

    <div class="content-block dx-card responsive-paddings">
      <dx-form
        id="form"
        label-location="top"
        :form-data="formData"
        :colCountByScreen="colCountByScreen"
      />
    </div>
  </div>
</template>

<script>
import DxForm from "devextreme-vue/form";

export default {
  props: {
    picture: String
  },
  setup() {
    const picture = "avatar.jpg";
    
    const imageSrc = `/dist/${picture}`;
    const formData = {
      ID: 7,
      FirstName: "Дмитрий",
      LastName: "Мирошкин",
      Prefix: "г-н",
      Position: "Начальник ИТ отдела",
      Picture: picture,
      BirthDate: new Date("1964/09/09"),
      HireDate: new Date("2020/10/01"),
      Notes:
        "Руководитель ИТ отдела компании Спутник-Гермес" 
,
      Address: "Самарская обл. пгт. Усть-Кинельский"
    };
    const colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    }

    return {
      imageSrc,
      formData,
      colCountByScreen
    };
  },
  components: {
    DxForm
  }
};
</script>

<style lang="scss">
.form-avatar {
  float: left;
  height: 120px;
  width: 120px;
  margin-right: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff;
  overflow: hidden;

  img {
    height: 120px;
    display: block;
    margin: 0 auto;
  }
}
</style>
