<template>
  <div>
    <div class="i-button-wrapper">
      <i-button type="info" @click="toProblemAdd">新增</i-button>
      <i-button type="error" @click="handleDeleteMore">批量删除</i-button>
    </div>

    <div class="date-wrapper">
      <Card>
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
        <p slot="title">MainDescription</p>
        <p v-html="serializeText(viewData.MainDescription)"></p>
        <img v-for="item in viewData.ImageList"
             :src="`/images/problem/${item.url}`"
             :alt="item.name" width="200" height="200">
      </i-card>

      <i-card class="i-card" v-if="viewData.InputDescription">
        <p slot="title">InputDescription</p>
        <p v-html="serializeText(viewData.InputDescription)"></p>
      </i-card>

      <i-card class="i-card" v-if="viewData.OutputDescription">
        <p slot="title">OutputDescription</p>
        <p v-html="serializeText(viewData.OutputDescription)"></p>
      </i-card>

      <i-card class="i-card" v-if="viewData.SampleInput">
        <p slot="title">SampleInput</p>
        <p v-html="serializeText(viewData.SampleInput)"></p>
      </i-card>

      <i-card class="i-card" v-if="viewData.SampleOutput">
        <p slot="title">SampleOutput</p>
        <p v-html="serializeText(viewData.SampleOutput)"></p>
      </i-card>

      <i-card class="i-card" v-if="viewData.DataSize">
        <p slot="title">DataSize</p>
        <p v-html="serializeText(viewData.DataSize)"></p>
      </i-card>

    </i-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';

  import VPage from '../base/vPage';
  import Table from '../api/table';
  import { config as ProblemConfig } from '../model/problem';

  export default {
    props: {
      type: {
        type: String,
        default: '省赛'
      }
    },
    data() {
      return {
        data: [],
        showModal: false,
        viewData: {},
        deleteList: [],
        deleteAllToggle: false,
        table: {},
        pageNum: 1,
        pageSize: 10,
        total: 0,
        title: ''
      };
    },
    computed: {
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
      this.LANGUAGE_LIST = ProblemConfig.LANGUAGE_LIST;
      this.YEAR_LIST = ProblemConfig.YEAR_LIST;
      this.DIFFICULTY_LIST = ProblemConfig.DIFFICULTY_LIST;
      this.initTable();
    },
    mounted() {
      this.getProblemList();
      this.getProblemListCount();
    },
    methods: {
      async getProblemList() {
        this.table.loading = true;
        try {
          const params = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            condition: this.table.conditions
          };

          const result = await axios.get('/problem/list', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.data = data.result;
            this.table.loading = false;
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      async getProblemListCount() {
        try {
          const params = {
            condition: this.table.conditions
          };

          const result = await axios.get('/problem/count', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.total = data.result;
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      handleChangePageNum(num) {
        this.pageNum = num;
        this.getProblemList();
      },
      handleChangePageSize(size) {
        this.pageSize = size;
        this.getProblemList();
      },
      handleDeleteMore() {
        this.table.deleteMore('problem');
      },
      serializeText(text) {
        return text && text.replace(/</g, '&lt').replace('/>/g', '&gt').replace(/\n/g, '<br />');
      },
      initTable() {
        let columns = [
          {
            title: '标题',
            key: 'Title'
          },
          {
            title: '语言',
            key: 'Language'
          },
          {
            title: '年份',
            key: 'Year'
          },
          {
            title: '难度',
            key: 'Difficulty'
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
                this.table.deleteOne(params.row, 'problem')
              }).bind(this);
            }
          }
        ];

        let conditions = {
          Difficulty: '',
          Year: '',
          Type: this.type,
          Language: ''
        };

        let params = [
          this,
          columns,
          buttons,
          conditions,
          this.getProblemList,
          this.getProblemListCount
        ];

        this.table = new Table(...params);
        this.table.addFilterRemote('语言', this.LANGUAGE_LIST);
        this.table.addFilterRemote('年份', this.YEAR_LIST);
        this.table.addFilterRemote('难度', this.DIFFICULTY_LIST);
      },
      toProblemAdd() {
        this.$router.push('/manager/problemAdd');
      },
      toProblemEdit(problemId) {
        this.$router.push({
          path: `/manager/problemEdit/${problemId}`
        })
      }
    },
    watch: {
      type(newVal) {
        this.table.conditions.Type = newVal;
        this.pageNum = 1;
        this.getProblemList();
        this.getProblemListCount();
      },
      title(newVal) {
        this.table.conditions.Title = {'regexp': newVal};
        this.getProblemList();
        this.getProblemListCount();
      }
    },
     components: {
      VPage
    }
  };
</script>

<style scoped>
  .i-card{
    margin: 20px 10px;
  }

  .i-card p {
    white-space: pre-wrap;
  }

  .date-wrapper{
    margin: 20px 0;
  }

  .i-button-wrapper{
    margin-bottom: 20px;
  }
</style>
