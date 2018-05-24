<template>
  <div class="v-header">
    <i-row class="v-header-row">

      <i-col span="22">
        <i-breadcrumb>
          <i-breadcrumb-item v-for="(item, index) in list" key="index">
            {{item.tag}}
          </i-breadcrumb-item>
        </i-breadcrumb>
      </i-col>

      <i-col span="2">
        <div class="button-wrapper">
          <i-button @click="logout" type="error" size="large">注销</i-button>
        </div>
      </i-col>

    </i-row>
  </div>
</template>

<script type="text/ecmascript-6">
  import LocalStorage from '../api/local-storage';

  export default {
    data() {
      return {
        list: [
          {
            'tag': '后台管理'
          }
        ]
      };
    },
    methods: {
      logout() {
        LocalStorage.clear();
        this.$router.push('/');
      }
    }
  };
</script>

<style>
  .v-header{
    display: flex;
    height: 60px;
    line-height: 60px;
    padding-left: 30px;
    align-items: center;
    background-color: #EFF2F7;
  }

  .v-header-row{
    width: 100%;
    font-size: 24px;
  }
</style>
