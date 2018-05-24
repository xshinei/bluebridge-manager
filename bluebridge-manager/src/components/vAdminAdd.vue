<template>
  <i-form :model="values" :rules="RULES" :label-width="80" ref="form">

    <i-form-item label="姓名:" prop="name">
      <i-input size="large" v-model="values.name" style="width: 200px;">
        <Icon type="ios-person" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <i-form-item label="账号:" prop="username">
      <i-input size="large" v-model="values.username" style="width: 200px;">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <i-form-item label="密码:" prop="password">
      <i-input size="large" v-model="values.password" style="width: 200px;">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <i-form-item label="确认密码:" prop="passwordAgain">
      <i-input size="large" v-model="values.passwordAgain" type="password" style="width: 200px;">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <v-avatar user="admin"
              :avatarName="values.avatar"
              @change="handleAvatarChange">
    </v-avatar>

    <i-form-item>
      <i-button type="primary" @click="handleSubmit">提交</i-button>
    </i-form-item>
  </i-form>
</template>

<script>
  import axios from 'axios';
  import { toFirstUpper } from '../api/util';
  import { config as FormConfig } from '../api/form';

  import VAvatar from '../base/vAvatar';

  export default {
    data() {
      return {
        values: {}
      };
    },
    created() {
      //验证存在性
      const exist = async (rule, value, callback) => {
        try {
          const params = {
            key: toFirstUpper(rule.field),
            value
          };

          const result = await axios.post('/admin/validate', params);
          const data = result.data;

          if(data.result !== '') {
            data.result ? callback(new Error('已经存在!')) : callback();
          }
        }
        catch (err) {
          console.log(err.message);
        }
      };

      //确认密码
      const passAgain = (rule, value, callback) => {
        if(value !== this.values.password) {
          callback(new Error('两次输入密码不一致!'));
        }

        callback();
      };

      this.RULES = {
        name: [
          { required: true, message: '姓名不能为空!', trigger: 'blur' },
          { pattern: FormConfig.name.regexp, message: FormConfig.name.text, trigger: 'blur' },
        ],
        username: [
          { required: true, message: '账号不能为空!', trigger: 'blur' },
          { pattern: FormConfig.username.regexp, message: FormConfig.username.text, trigger: 'blur' },
          { validator: exist, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空!', trigger: 'blur' },
          { pattern: FormConfig.password.regexp, message: FormConfig.password.text, trigger: 'blur' }
        ],
        passwordAgain: [
          { required: true, message: '密码不能为空!', trigger: 'blur' },
          { validator: passAgain, trigger: 'blur' }
        ]
      };
    },
    methods: {
      async handleSubmit() {
        const form = this.$refs.form;

        try {
          const validateResult = await form.validate();

          if(validateResult) {
            //表单验证成功
            const params = {
              name: this.values.name,
              username: this.values.username,
              password: this.values.password,
              avatar: this.values.avatar
            };

            const result = await axios.post('/admin/add', params);
            const data = result.data;

            if(data.status === 0) {
              if(data.result !== '') {
                this.$Message.success(data.msg);

                //表单重置
                form.resetFields();
                this.values = {};
              }
              else {
                this.$Message.error(data.msg);
              }
            }
            else {
              throw new Error(data.msg);
            }
          }
          else {
            this.$Message.error('请按要求输入!');
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      handleAvatarChange(val) {
        this.values.avatar = val;
      }
    },
    components: {
      VAvatar
    }
  }
</script>

<style scoped>

</style>




