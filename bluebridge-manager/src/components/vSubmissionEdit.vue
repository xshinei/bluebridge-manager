<template>
  <i-form :model="values" :rules="validator" :label-width="80" ref="form">

    <i-form-item label="评分:">
      <i-tooltip content="范围为: 0 - 100" placement="right">
        <i-input-number v-model="values.score" :min="0" :max="100" :editable="true"></i-input-number>
      </i-tooltip>
    </i-form-item>

    <i-form-item label="代码:">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.code"
               style="width: 500px;">
      </i-input>
    </i-form-item>

    <i-form-item label="评语:">
      <i-input size="large"
               type="textarea"
               :rows="10"
               v-model="values.remark"
               style="width: 500px;">
      </i-input>
    </i-form-item>

    <i-form-item>
      <Button type="primary" @click="handleSubmit">提交</Button>
    </i-form-item>

  </i-form>
</template>

<script>

  import axios from 'axios';
  import { toFirstLower, toFirstUpper } from '../api/util';

  export default {
    props: {
      submissionId: {
        type: String
      }
    },
    data() {
      return {
        values: {},
        validator: {}
      };
    },
    mounted() {
      this.getSubmission();
    },
    methods: {
      async getSubmission() {
        try {
          const params = {
            id: this.submissionId
          };

          const result = await axios.get('/submission/one', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.values = toFirstLower(data.result);
          }
          else {
            throw new Error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      async handleSubmit() {
        try {
          const params = {
            id: this.submissionId,
            submission: toFirstUpper(this.values)
          };

          const result = await axios.post('/submission/edit', params);
          const data = result.data;

          if(data.status === 0) {
            if(data.result !== '') {
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
  }
</script>

<style scoped>

</style>
