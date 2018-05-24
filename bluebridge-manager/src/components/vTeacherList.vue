<template>
    <div>
      <div class="i-button-wrapper">
        <i-button type="error" @click="handleDeleteMore">批量删除</i-button>
      </div>

      <div class="date-wrapper">
        <Card>
          <i-input v-model="name" size="large" placeholder="教师姓名" clearable style="width: 200px;"></i-input>
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

<script>
  import axios from 'axios';

  import Table from '../api/table';
    import ServerConfig from '../api/server-config';

  import VPage from '../base/vPage';

  export default {
    data() {
      return {
        table: {},
        data: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: ''
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
      this.AVATAR_URL = ServerConfig.AVATAR_URL;
      this.initTable();
    },
    mounted() {
      this.getTeacherList();
      this.getTeacherCount();
    },
    methods: {
      /**
       *  获取教师列表
       */
      async getTeacherList() {
        this.table.loading = true;

        try {
          const params = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            condition: this.table.conditions
          };

          const result = await axios.get('/teacher/list', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.data = data.result;
            this.table.loading = false;
          }
          else {
            this.$Message.error(data.msg);
          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      /**
       *  获取教师总数目
       */
      async getTeacherCount() {
        try {
          const params = {
            condition: this.table.conditions
          };

          const result = await axios.get('/teacher/count', {params});
          const data = result.data;

          if(data.status === 0 && data.result !== '') {
            this.total = data.result;
          }
          else {

          }
        }
        catch (err) {
          console.log(err.message);
        }
      },
      /**
       *  页码改变
       */
      handleChangePageNum(num) {
        this.pageNum = num;
        this.getAdminList();
      },
      /**
       *  每页显示数目改变
       */
      handleChangePageSize(size) {
        this.pageSize = size;
        this.getAdminList();
      },
      handleDeleteMore() {
        this.table.deleteMore('teacher');
      },
      /**
       * 初始化表格
       * @return {function()}
       */
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
            title: '邮箱',
            key: 'Email'
          },
          {
            title: '上次登录时间',
            key: 'LastLoginTime'
          },
          {
            title: '注册时间',
            key: 'RegisterTime'
          }
        ];

        const buttons = [
          {
            type: 'Edit',
            handleClick: (params) => {
              return (function () {
                this.toTeacherEdit(params.row.Id);
              }).bind(this);
            }
          },
          {
            type: 'Del',
            handleClick(params) {
              return () => {
                console.log(this);
                this.table.deleteOne(params.row, 'teacher');
              };
            }
          }
        ];

        const conditions = {
          Name: ''
        };

        const params = [
          this,
          columns,
          buttons,
          conditions,
          this.getTeacherList,
          this.getTeacherCount
        ];

        this.table = new Table(...params);

        this.table.addColumn('姓名', '头像', (h, params) => {
          return h('Avatar', {
            props: {
              icon: 'person',
              size: 'large',
              src: `${this.AVATAR_URL}/${params.row.Avatar}`
            }
          })
        });
      },
      toTeacherEdit(teacherId) {
        this.$router.push({
          path: `teacherEdit/${teacherId}`
        });
      }
    },
    watch: {
      name(newVal) {
        this.table.conditions.Name = {'regexp': newVal};
        this.getTeacherList();
        this.getTeacherCount();
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
