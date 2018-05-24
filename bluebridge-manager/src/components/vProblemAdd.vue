<template>
  <i-form :model="values" :rules="RULES" :label-width="80" ref="form">
    <i-form-item label="标题:" prop="title">
      <i-input size="large" v-model="values.title" style="width: 200px;"></i-input>
    </i-form-item>

    <i-form-item label="类型:" prop="type">
      <i-radio-group v-model="values.type" size="large">
        <i-radio v-for="item in TYPE_LIST" :label="item" :key="item">{{item}}</i-radio>
      </i-radio-group>
    </i-form-item>

    <i-form-item label="语言:" prop="language">
      <i-radio-group v-model="values.language" size="large">
        <i-radio v-for="item in LANGUAGE_LIST" :label="item" :key="item">{{item}}</i-radio>
      </i-radio-group>
    </i-form-item>

    <i-form-item label="年份:" prop="year">
      <i-select v-model="values.year"  style="width: 200px;">
        <i-option v-for="item in YEAR_LIST" :value="item" :key="item">{{item}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="难度:" prop="difficulty">
      <i-select v-model="values.difficulty"  style="width: 200px;">
        <i-option v-for="item in DIFFICULTY_LIST" :value="item" :key="item">{{item}}</i-option>
      </i-select>
    </i-form-item>

    <i-form-item label="排序Id:" prop="sortId">
      <i-tooltip content="范围为: 1 - 10" placement="right">
        <i-input-number v-model="values.sortId" :min="1" :max="10" :editable="false"></i-input-number>
      </i-tooltip>
    </i-form-item>

    <i-form-item label="题目描述:" prop="mainDescription">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.mainDescription"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item label="图片:">
      <i-upload action="/problem/upload"
                :headers="{Authorization: LocalStorage.getItem('token')}"
                name="problem"
                multiple
                :format="['jpg','jpeg','png']"
                :on-success="handleUploadSuccess"
                :onFormatError="handleFormatError"
                :on-preview="handleUploadPreview"
                :on-remove="handleUploadRemove"
                ref="Upload"
                style="width: 200px; white-space: pre-wrap">
        <i-button type="ghost" icon="ios-cloud-upload-outline">上传</i-button>
      </i-upload>
    </i-form-item>

    <i-form-item label="输入描述:" prop="inputDescription">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.inputDescription"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item label="输出描述:" prop="outputDescription">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.outputDescription"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item label="样例输入:" prop="sampleInput">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.sampleInput"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item label="样例输出:" prop="sampleOutput">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.sampleOutput"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item label="数据范围:" prop="dataSize">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.dataSize"
               style="width: 500px; white-space: pre-wrap;">
      </i-input>
    </i-form-item>

    <i-form-item>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </i-form-item>

    <i-modal :title="modalInfo.title" v-model="modalInfo.show">
      <img :src="modalInfo.imgUrl" width="100%">
    </i-modal>

  </i-form>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';

  import { toFirstUpper } from '../api/util';
  import { config as ProblemConfig } from '../model/problem';
  import LocalStorage from '../api/local-storage';

  export default {
    data() {
      return {
        values: {
          imageList: [],
          inputDescription: '',
          outputDescription: '',
          sampleInput: '',
          sampleOutput: '',
          dataSize: '',
          sortId: 1
        },
        modalInfo: {
          show: false,
          imgUrl: '',
          title: ''
        }
      };
    },
    created() {
      this.TYPE_LIST = ProblemConfig.TYPE_LIST;
      this.LANGUAGE_LIST = ProblemConfig.LANGUAGE_LIST;
      this.YEAR_LIST = ProblemConfig.YEAR_LIST;
      this.DIFFICULTY_LIST = ProblemConfig.DIFFICULTY_LIST;
      this.LocalStorage = LocalStorage;

      this.RULES = {
        title: [
          { required: true, message: '标题不能为空！', trigger: 'blur' }
        ],
        type: [
          {required: true, pattern: /.+/, message: '类型不能为空！', trigger: 'blur' }
        ],
        language: [
          {required: true, pattern: /.+/, message: '语言不能为空！', trigger: 'blur' }
        ],
        year: [
          {required: true, pattern: /.+/, message: '年份不能为空！', trigger: 'blur' }
        ],
        difficulty: [
          {required: true, pattern: /.+/, message: '难度不能为空！', trigger: 'blur' }
        ],
        sortId: [
          {required: true, pattern: /.+/, message: 'SortId不能为空！', trigger: 'blur' }
        ],
        mainDescription: [
          {required: true, message: '题目描述不能为空！', trigger: 'blur' }
        ],
        inputDescription: {},
        outputDescription: {},
        sampleInput: {},
        sampleOutput: {},
        dataSize: {}
      };
    },
    methods: {
      async handleSubmit() {
        const form = this.$refs.form;

        try {
          const validateResult = await form.validate();

          if(validateResult) {
            const params = {
              problem: toFirstUpper(this.values)
            };

            const result = await axios.post('/problem/add', params);
            const data = result.data;

            if(data.status === 0) {
              if(data.result !== '') {
                this.$Message.success(data.msg);
                form.resetFields();
                this.$refs.Upload.clearFiles();
                this.values.imageList = [];
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
      handleFormatError(file) {
        this.$Message.error(`文件${file.name} 格式不正确, 请选择png或jpg!`);
      },
      handleUploadSuccess(res) {
        this.$Message.success('上传成功！');

        const image = {
          url: res.result
        };

        this.values.imageList.push(image);
      },
      handleUploadPreview(file) {
        this.modalInfo.imgUrl = `/images/problem/${file.response.result}`;
        this.modalInfo.title = file.name;
        this.modalInfo.show = true;
      },
      async handleUploadRemove(file) {
        //在服务器上将图片删除
        try {
          const params = {
            filename: file.name
          };

          const result = await axios.post('/problem/delete', params);
          const data = result.data;

          if(data.status === 0) {
            if(data.result !== '') {
              //同时删除数据库中对应的url
              this.values.imageList.forEach((image, index) => {
                if(image.url === file.name) {
                  this.values.imageList.splice(index, 1);
                }
              });
              this.$Message.success(data.msg);
            }
            else {
              this.$Message.error(data.msg);
            }
          }
          else {
            throw new Error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      }
    }
  };
</script>

<style>

</style>
