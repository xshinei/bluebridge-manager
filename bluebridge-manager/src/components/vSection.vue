<template>

  <i-menu theme="dark" width="auto" class="i-menu">
    <div class="avatar-wrapper">
      <i-avatar icon="person" size="large" :src="`${AVATAR_URL}/${admin.Avatar}`"></i-avatar>
    </div>
    <i-submenu name="1">
      <template slot="title">
        <Icon type="person"></Icon>
        用户管理
      </template>
      <MenuItem name="1-1">
        <router-link to="/manager/adminList">管理员</router-link>
      </MenuItem>
      <MenuItem name="1-2">
        <router-link to="/manager/teacherList">教师</router-link>
      </MenuItem>
      <MenuItem name="1-3">
        <router-link to="/manager/studentList">学生</router-link>
      </MenuItem>
    </i-submenu>
    <i-submenu name="2">
      <template slot="title">
        <Icon type="ios-keypad"></Icon>
        题库管理
      </template>
      <MenuItem name="2-1">
        <router-link to="/manager/problemList/省赛">省赛真题</router-link>
      </MenuItem>
      <MenuItem name="2-2">
        <router-link to="/manager/problemList/决赛">决赛真题</router-link>
      </MenuItem>
      <MenuItem name="2-3">
        <router-link to="/manager/problemList/校内选拔赛">校内选拔赛真题</router-link>
      </MenuItem>
    </i-submenu>
    <i-submenu name="3">
      <template slot="title">
        <Icon type="ios-analytics"></Icon>
        提交记录管理
      </template>
      <MenuItem name="3-1">
        <router-link to="/manager/submissionList">提交记录</router-link>
      </MenuItem>
    </i-submenu>
  </i-menu>

</template>

<script>

  import LocalStorage from '../api/local-storage';
  import ServerConfig from '../api/server-config';

  export default {
    created() {
      this.AVATAR_URL = ServerConfig.AVATAR_URL;
      this.admin = LocalStorage.getItem('admin');
    }
  };
</script>

<style scoped>
  a {
    color: rgba(255,255,255,.7);
  }

  .i-menu {
    height: 100%;
  }

  .avatar-wrapper{
    padding: 20px 0;
    text-align: center;
  }
</style>
