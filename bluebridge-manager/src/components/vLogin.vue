<template>
  <div class="login-wrapper">
    <div class="login-content">
      .
      <i-form ref="form" :model="values" :rules="validator">

        <i-form-item prop="username">
          <i-input type="text" size="large" v-model="values.username" placeholder="用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </i-input>
        </i-form-item>

        <i-form-item prop="password">
          <i-input type="password" size="large" v-model="values.password" placeholder="密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
          </i-input>
        </i-form-item>

        <i-form-item>
          <div class="submit-wrapper">
            <i-button type="primary" @click="handlerSubmit">登录</i-button>
          </div>
        </i-form-item>

      </i-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import LocalStorage from '../api/local-storage';

  export default {
    data() {
      return {
        values: {
          username: '',
          password: ''
        },
        validator: {
          username: {required: true, message: '用户名不能为空！', trigger: 'blur'},
          password: {required: true, message: '密码不能为空！', trigger: 'blur'}
        }
      };
    },
    mounted() {
      if(LocalStorage.getItem('admin')) {
        this.$Message.success('检测到您的登录记录!');

        setTimeout(() => {
          this.$router.push('/manager');
        }, 2000);
      }
    },
    methods: {
      async handlerSubmit() {
        try {
          const form = this.$refs.form;
          const param = this.values;

          const result = await form.validate();

          if(result) {
            const res = await axios.post('/admin/login', param);
            const data = res.data;

            if(data.status === 0) {
              if(data.result !== '') {
                //表单重置
                form.resetFields();

                //存入localStorage
                LocalStorage.setItem('admin', data.result);
                LocalStorage.setItem('token', data.token);

                this.$Message.success(data.msg);

                //跳转
                this.$router.push('/manager');
              }
              else {
                this.$Message.error(data.msg);
              }
            }
            else {
              throw new Error(data.msg);
            }
          }
        }
        catch (err) {
          console.log(err.message);
        }
      }
    }
  }
</script>

<style scoped>
  .login-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .login-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -80%);
    width: 500px;
    height: 250px;
    padding: 50px 100px;
    background-color: #bbbec4;
  }

  .submit-wrapper {
    width: 50px;
    margin: 0 auto;
  }
</style>
