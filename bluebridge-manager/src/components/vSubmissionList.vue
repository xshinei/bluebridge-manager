<template>
  <div>

    <div class="i-button-wrapper">
      <i-button type="error" @click="handleDeleteMore">批量删除</i-button>
    </div>

    <div class="date-wrapper">
      <Card>
        <i-input v-model="name" size="large" placeholder="学生姓名" clearable style="width: 200px;"></i-input>
        <i-input v-model="title" size="large" placeholder="标题" clearable style="width: 200px;"></i-input>
      </Card>
    </div>

    <i-table
      :columns="table.columns"
      :data="data"
      :stripe="true"
      :highlight-row="true"
      :loading="table.loading"
      ref="Table"
      @on-select="handleTableSelect"
      @on-select-cancel="handleTableSelectCancel"
      @on-select-all="handleTableSelectAll"
      @on-selection-change="handleTableSelectChange">
    </i-table>

    <v-page :page-num="pageNum"
            :page-size="pageSize"
            :total="total"
            @changePageNum="handleChangePageNum"
            @changePageSize="handleChangePageSize">
    </v-page>

    <i-modal v-model="showModal">
      <i-card class="i-card">
        <p slot="title">代码</p>
        <p v-html="serializeCode" style="white-space: pre-wrap;"></p>
      </i-card>
      <i-card class="i-card" v-if="viewData.Remark">
        <p slot="title">评语</p>
        <p v-html="viewData.Remark" style="white-space: pre-wrap;"></p>
      </i-card>
    </i-modal>

  </div>
</template>

<script>

  import axios from 'axios';
  import Table from '../api/table';
  import { config as ProblemConfig } from '../model/problem';

  import VPage from '../base/vPage';

  export default {
    data() {
      return {
        data: [],
        table: {},
        name: '',
        title: '',
        pageNum: 1,
        pageSize: 10,
        total: 0,
        viewData: {},
        showModal: false,
      };
    },
    computed: {
      serializeCode() {
        return this.viewData.Code && this.viewData.Code.replace(/\n/g, '<br/>')
      },
      handleTableSelect() {
        return this.table.handleTableSelect.bind(this.table);
      },
      handleTableSelectCancel() {
        return this.table.handleTableSelectCancel.bind(this.table);
      },
      handleTableSelectAll() {
        return this.table.handleTableSelectAll.bind(this.table);
      },
      handleTableSelectChange() {
        return this.table.handleTableSelectChange.bind(this.table);
      }
    },
    created() {
      this.YEAR_LIST = ProblemConfig.YEAR_LIST;
      this.TYPE_LIST = ProblemConfig.TYPE_LIST;
      this.LANGUAGE_LIST = ProblemConfig.LANGUAGE_LIST;

      this.initTable();
    },
    mounted() {
      this.getSubmissionList();
      this.getSubmissionCount();
    },
    methods: {
      async getSubmissionList() {
        this.table.loading = true;

        try {
          const params = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            condition: this.table.conditions
          };

          const result = await axios.get('/submission/list', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.data = data.result;
            this.table.loading = false;
          }
          else {
            throw new Error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      async getSubmissionCount() {
        try {
          const params = {
            condition: this.table.conditions
          };

          const result = await axios.get('/submission/count', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.total = data.result;
          }
          else {
            throw new Error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      handleChangePageNum(num) {
        this.pageNum = num;
        this.getSubmissionList();
      },
      handleChangePageSize(size) {
        this.pageSize = size;
        this.getSubmissionList();
      },
      handleDeleteMore() {
        this.table.deleteMore('submission');
      },
      initTable() {
        let columns = [
          {
            title: '姓名',
            key: 'Name',
            width: 70
          },
          {
            title: '标题',
            key: 'Title'
          },
          {
            title: '年份',
            key: 'Year',
            width: 100
          },
          {
            title: '类型',
            key: 'Type',
            width: 100
          },
          {
            title: '语言',
            key: 'Language',
            width: 100
          },
          {
            title: '提交时间',
            key: 'SubmitTime',
            width: 150
          },
          {
            title: '批阅时间',
            key: 'CorrectTime',
            width: 150
          },
          {
            title: '评分',
            key: 'Score'
          },
          {
            title: '是否批阅',
            key: 'HasCorrected',
            width: 100
          }
        ];

        let buttons = [
          {
            type: 'View',
            handleClick: (params) => {
              return (function () {
                this.showModal = true;
                this.viewData = params.row;
              }).bind(this);
            }
          },
          {
            type: 'Edit',
            handleClick: (params) => {
              return (function () {
                this.toProblemEdit(params.row.Id);
              }).bind(this);
            }
          },
          {
            type: 'Del',
            handleClick(params) {
              return (function () {
                this.table.deleteOne(params.row, 'submission');
              }).bind(this);
            }
          }
        ];

        let conditions = {
          HasCorrected: '',
          Name: '',
          Type: '',
          Year: '',
          Language: ''
        };

        let params = [
          this,
          columns,
          buttons,
          conditions,
          this.getSubmissionList,
          this.getSubmissionCount
        ];

        this.table = new Table(...params);

        this.table.addFilterRemote('是否批阅', [true, false]);
        this.table.addFilterRemote('年份', this.YEAR_LIST);
        this.table.addFilterRemote('语言', this.LANGUAGE_LIST);
        this.table.addFilterRemote('类型', this.TYPE_LIST);
      },
      toProblemEdit(submissionId) {
        this.$router.push({
          path: `submissionEdit/${submissionId}`
        })
      }
    },
    watch: {
      name(newVal) {
        this.table.conditions.Name = {'regexp': newVal};
        this.getSubmissionList();
        this.getSubmissionCount();
      },
      title(newVal) {
        this.table.conditions.Title = {'regexp': newVal};
        this.getSubmissionList();
        this.getSubmissionCount();
      }
    },
    components: {
      VPage
    }
  }
</script>

<style scoped>
  .i-button-wrapper{
    margin-bottom: 20px;
  }

  .date-wrapper{
    margin: 20px 0;
  }
</style>
