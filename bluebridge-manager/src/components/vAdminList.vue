<template>
  <div>
    <div class="i-button-wrapper">
      <i-button type="info" @click="toAdminAdd">新增</i-button>
      <i-button type="error" @click="handleDeleteMore">批量删除</i-button>
    </div>

    <div class="date-wrapper">
      <Card>
        <DatePicker v-model="table.conditions.RegisterTime.start" type="date" placeholder="起始时间" style="width: 200px"></DatePicker>
        <span>----</span>
        <DatePicker v-model="table.conditions.RegisterTime.end" type="date" placeholder="截止时间" style="width: 200px"></DatePicker>
        <i-button type="primary" @click="getAdminList">筛选</i-button>
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

  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios';
  import Table from '../api/table';

  import VPage from '../base/vPage';

  export default {
    data() {
      return {
        table: {},
        data: [],
        page: {},
        pageNum: 1,
        pageSize: 10,
        total: 0
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
      this.initTable();
    },
    mounted() {
      this.getAdminList();
      this.getAdminCount();
    },
    methods: {
      getAdminList() {
        this.table.loading = true;
        axios.get('/admin/list', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            condition: this.table.conditions
          }
        })
          .then(res => {
            if(res.data.status === 0 && res.data.status !== '') {
              this.data = res.data.result;
              this.table.loading = false;
            }
          });
      },
      getAdminCount() {
        axios.get('/admin/count', {
          params: {
            condition: this.table.conditions
          }
        })
          .then(res => {
            if(res.data.status === 0 && res.data.status !== '') {
              this.total = res.data.result;
            }
          });
      },
      handleFilterRegisterDate() {
        this.getAdminList();
        this.table.start = '';
        this.table.end = '';
      },
      handleChangePageNum(num) {
        this.pageNum = num;
        this.getAdminList();
      },
      handleChangePageSize(size) {
        this.pageSize = size;
        this.getAdminList();
      },
      handleDeleteMore() {
        this.table.deleteMore('admin');
      },
      initTable() {
        let columns = [
          {
            title: '姓名',
            key: 'Name'
          },
          {
            title: '用户名',
            key: 'Username'
          },
          {
            title: '上次登录时间',
            key: 'LastLoginTime'
          },
          {
            title: '注册时间',
            key: 'RegisterTime'
          },
          {
            title: '权限',
            key: 'Jurisdiction'
          }
        ];

        let buttons = [
          {
            type: 'Edit',
            handleClick: (params) => {
              return (function () {
                this.toAdminEdit(params.row.Id);
              }).bind(this);
            }
          },
          {
            type: 'Del',
            handleClick: (params) => {
              return (function () {
                this.table.deleteOne(params.row, 'admin');
              }).bind(this);
            }
          }
        ];

        let conditions = {
          RegisterTime: {
            start: '',
            end: ''
          },
          LoginStatus: ''
        };

        this.table = new Table(this, columns, buttons, conditions, this.getAdminList, this.getAdminCount);
        this.table.addColumn('姓名', '头像', (h, params) => {
          return h('Avatar', {
            props: {
              icon: 'person',
              size: 'large',
              src: `/images/avatar/${params.row.Avatar}`
            }
          })
        });
      },
      toAdminAdd() {
        this.$router.push('adminAdd');
      },
      toAdminEdit(adminId) {
        this.$router.push(`adminEdit/${adminId}`);
      }
    },
    components: {
      VPage
    }
  };
</script>

<style scoped>
  .date-wrapper{
    margin: 20px 0;
  }
</style>
