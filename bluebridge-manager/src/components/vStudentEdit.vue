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

    <i-form-item label="年级:" prop="grade">
      <i-select v-model="values.grade"  style="width: 200px;">
        <i-option v-for="item in GRADE_LIST" :value="item" :key="item">{{item}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="专业:" prop="profession">
      <i-select v-model="values.profession"  style="width: 200px;">
        <i-option v-for="item in PROFESSION_LIST" :value="item" :key="item">{{item}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="语言:" prop="language">
      <i-select v-model="values.language"  style="width: 200px;">
        <i-option v-for="item in LANGUAGE_LIST" :value="item" :key="item">{{item}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="指导老师:" prop="teacherId">
      <i-select v-model="values.teacherId"  style="width: 200px;">
        <i-option v-for="(item, index) in teacherList" :value="item.Id" :key="index">{{item.Name}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="允许登录:"  prop="permitLogin">
      <i-switch v-model="values.permitLogin">
        <span slot="open">是</span>
        <span slot="close">否</span>
      </i-switch>
    </i-form-item>

    <v-avatar user="student"
              :userId="studentId"
              :avatarName="values.avatar"
              @change="handleAvatarChange">
    </v-avatar>

    <i-form-item>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </i-form-item>

  </i-form>
</template>

<script>

  import axios from 'axios';
  import {toFirstLower, toFirstUpper} from '../api/util';
  import { config as StudentConfig } from '../model/student';
  import { config as FormConfig } from '../api/form';

  import VAvatar from '../base/vAvatar';

  export default {
    props: {
      studentId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        values: {},
        primitiveInfo: {},
        teacherList: []
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

          const result = await axios.post('/student/validate', params);
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            data.result ? callback(new Error('已经存在!')) : callback();
          }
        }
        catch (err) {

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
      this.GRADE_LIST = StudentConfig.GRADE_LIST;
      this.PROFESSION_LIST = StudentConfig.PROFESSION_LIST;
      this.LANGUAGE_LIST = StudentConfig.LANGUAGE_LIST;
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
        ],
        profession: [
          { required: true, pattern: /.+/, message: '不能为空!', trigger: 'change' }
        ],
        grade: [
          { required: true, pattern: /.+/, message: '不能为空!', trigger: 'change' },
        ],
        language: [
          { required: true, pattern: /.+/, message: '不能为空!', trigger: 'change' },
        ],
        permitLogin: [
          { required: true, pattern: /.+/, message: '不能为空!', trigger: 'change' },
        ],
        teacherId: [
          { required: true, pattern: /.+/, message: '不能为空!', trigger: 'change' }
        ]
      };
    },
    mounted() {
      this.getStudent();
      this.getTeacherList();
    },
    methods: {
      getStudent() {
        axios.get('/student/one', {
          params: {
            id: this.studentId
          }
        })
          .then(res => {
            if(res.data.status === 0) {
              this.values = toFirstLower(res.data.result);
              this.primitiveInfo = Object.assign({}, this.values);
            }
          });
      },
      getTeacherList() {
        axios.get('/teacher/list')
          .then(res => {
            if(res.data.status === 0) {
              this.teacherList = res.data.result;
            }
          });
      },
      async handleSubmit() {
        const form = this.$refs.form;

        try {
          const validateResult = await form.validate();

          if(validateResult) {
            if(this.values.password === this.primitiveInfo.password) {
              delete this.values.password
            }

            const res = await axios.post('/student/edit', {
              id: this.studentId,
              student: toFirstUpper(this.values)
            });

            if(res.data.status === 0 && res.data.result !== '') {
              this.$Message.success(res.data.msg);
            }
            else {
              console.log(res.data.msg);
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
