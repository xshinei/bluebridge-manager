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
      <i-input size="large" v-model="values.password" style="width: 400px;">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <i-form-item label="邮箱:" prop="email">
      <i-input size="large" v-model="values.email" style="width: 200px;">
        <Icon type="ios-email-outline" slot="prepend"></Icon>
      </i-input>
    </i-form-item>

    <v-avatar user="teacher"
              :userId="teacherId"
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

  import {toFirstLower, toFirstUpper} from '../api/util';
  import { config as FormConfig } from '../api/form';

  import VAvatar from '../base/vAvatar';

  export default {
    props: {
      teacherId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        values: {},
        primitiveInfo: {}
      };
    },
    created() {
      //验证存在性
      const exist = async (rule, value, callback) => {
        try {
          //与初始值相同，即没有发生修改
          if(value === this.primitiveInfo[rule.field]) {
            callback();
          }

          const params = {
            key: toFirstUpper(rule.field),
            value
          };

          const result = await axios.post('/teacher/validate', params);
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            data.result ? callback(new Error('已经存在!')) : callback();
          }
        }
        catch (err) {
          console.log(err.message);
        }
      };

      //验证密码
      const pass = (rule, value, callback) => {
        if(value === this.primitiveInfo[rule.field]) {
          callback();
        }

        //正则验证
        if(value.match(FormConfig.password.regexp)) {
          callback();
        }
        else {
          callback(FormConfig.password.text);
        }
      };

      //表单验证规则
      this.RULES = {
        name: [
          { required: true, message: '不能为空!', trigger: 'blur' },
          { pattern: FormConfig.name.regexp, message: FormConfig.name.text, trigger: 'blur'},
        ],
        username: [
          { required: true, message: '不能为空!', trigger: 'blur' },
          { pattern: FormConfig.username.regexp, message: FormConfig.username.text, trigger: 'blur'},
          { validator: exist, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '不能为空!', trigger: 'blur' },
          { pattern: FormConfig.email.regexp, message: FormConfig.email.text, trigger: 'blur'},
          { validator: exist, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空!', trigger: 'blur' },
          { validator: pass, trigger: 'blur' }
        ]
      };
    },
    mounted() {
      this.getTeacherInfo();
      this.$Message.config({
        duration: 3
      });
    },
    methods: {
      /**
       *  获取教师信息
       */
      async getTeacherInfo() {
        try {
          const params = {
            id: this.teacherId
          };

          const result = await axios.get('/teacher/one', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.values = toFirstLower(data.result);
            this.primitiveInfo = toFirstLower(Object.assign({}, data.result));
          }
          else {
            throw new Error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      /**
       *  表单提交
       */
      async handleSubmit() {
        const form = this.$refs.form;

        try {
          const validateResult = await form.validate();

          if(validateResult) {
            if(this.values.password === this.primitiveInfo.password) {
              delete this.values.password
            }

            const params = {
              id: this.teacherId,
              teacher: toFirstUpper(this.values)
            };

            const result = await axios.post('/teacher/edit', params);
            const data = result.data;

            if(data.status === 0 && data.result !== '') {
              this.$Message.success(data.msg);
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
