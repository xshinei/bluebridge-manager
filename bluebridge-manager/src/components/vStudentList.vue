<template>
  <div>

    <div class="i-button-wrapper">
      <i-button type="error" @click="handleDeleteMore">批量删除</i-button>
    </div>

    <div class="date-wrapper">
      <Card>
        <DatePicker v-model="table.conditions.RegisterTime.start" type="date" placeholder="注册起始时间" style="width: 200px"></DatePicker>
        <span>----</span>
        <DatePicker v-model="table.conditions.RegisterTime.end" type="date" placeholder="注册截止时间" style="width: 200px"></DatePicker>
        <i-button type="primary" @click="getStudentList">筛选</i-button>
        <i-input v-model="name"
                 size="large"
                 placeholder="学生姓名"
                 clearable
                 style="width: 200px; margin-left: 30px;">
        </i-input>
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
  import { config as StudentConfig } from '../model/student';

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
    created() {
      this.AVATAR_URL = ServerConfig.AVATAR_URL;
      this.PROFESSION_LIST = StudentConfig.PROFESSION_LIST;
      this.GRADE_LIST = StudentConfig.GRADE_LIST;

      this.initTable();
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
    mounted() {
      this.getStudentList();
      this.getStudentCount();
    },
    methods: {
      /**
       *  分页获取student记录 筛选条件可选
       */
      async getStudentList() {
        this.table.loading = true;

        try {
          const params = {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            condition: this.table.conditions
          };

          const result = await axios.get('/student/list', {params});
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
      /**
       * 获取student总数
       */
      async getStudentCount() {
        try {
          const params = {
            condition: this.table.conditions
          };

          const result = await axios.get('/student/count', {params});
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
        this.getAdminList();
      },
      handleChangePageSize(size) {
        this.pageSize = size;
        this.getAdminList();
      },
      handleDeleteMore() {
        this.table.deleteMore('student');
      },
      /**
       * 初始化表格
       */
      initTable() {
        const columns = [
          {
            title: '姓名',
            key: 'Name',
            width: 90
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
            title: '年级',
            key: 'Grade',
            width: 90
          },
          {
            title: '专业',
            key: 'Profession'
          },
          {
            title: '指导老师',
            key: 'TeacherName'
          },
          {
            title: '上次登录时间',
            key: 'LastLoginTime',
            width: 150
          },
          {
            title: '注册时间',
            key: 'RegisterTime',
            width: 150
          },
          {
            title: '允许登录',
            key: 'PermitLogin'
          }
        ];

        const buttons = [
          {
            type: 'Edit',
            handleClick: (params) => {
              return (function () {
                this.toStudentEdit(params.row.Id);
              }).bind(this);
            }
          },
          {
            type: 'Del',
            handleClick: (params) => {
              return (function () {
                this.table.deleteOne(params.row, 'student');
              }).bind(this);
            }
          }
        ];

        const conditions = {
          Grade: '',
          Profession: '',
          TeacherId: '',
          RegisterTime: {
            start: '',
            end: ''
          },
          PermitLogin: ''
        };

        const params = [
          this,
          columns,
          buttons,
          conditions,
          this.getStudentList,
          this.getStudentCount
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

        this.table.addFilterRemote('年级', this.GRADE_LIST);
        this.table.addFilterRemote('专业', this.PROFESSION_LIST);
        this.table.addFilterRemote('允许登录', [true, false]);
      },
      toStudentEdit(studentId) {
        this.$router.push({
          path: `studentEdit/${studentId}`
        });
      }
    },
    watch: {
      name(newVal) {
        this.table.conditions.Name = {'regexp': newVal};
        this.getStudentList();
        this.getStudentCount();
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
