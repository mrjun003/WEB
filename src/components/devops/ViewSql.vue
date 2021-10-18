<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item label="申请人：">
            <el-input v-model="filters.apply_user" placeholder="申请人"></el-input>
          </el-form-item>
          <el-form-item label="库名：">
            <el-input v-model="filters.inst_name" placeholder="实例名"></el-input>
          </el-form-item>
          <el-form-item label="所属应用：">
            <el-input v-model="filters.app" placeholder="应用"></el-input>
          </el-form-item>
          <el-form-item label="执行人：">
            <el-input v-model="filters.exec_user" placeholder="应用"></el-input>
          </el-form-item>
          <el-form-item label="申请时间：">
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.apply_time" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" style="text-align: right">
        <el-button @click="refresh()">刷新</el-button>
        <el-button v-if="has_permission('account_user_add')" style="float: right" type="primary"
                   @click="handleAdd()">SQL上线申请
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="apply_user" label="申请人" sortable></el-table-column>
      <el-table-column prop="inst_name" label="库名" sortable></el-table-column>
      <el-table-column prop="inst_apps" label="所属应用" sortable></el-table-column>
      <el-table-column prop="sql_status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag :type="(scope.row.sql_status == '执行成功' ? 'success' :
          (scope.row.sql_status == '执行失败' ? 'danger' :
          (scope.row.sql_status == '等待执行' ? 'info' : 'warning')))" size="medium">
            {{ scope.row.sql_status }}
          </el-tag>

        </template>
      </el-table-column>
      <el-table-column prop="exec_user" label="执行人" sortable></el-table-column>
      <el-table-column prop="apply_time" label="申请时间" sortable width="160px"></el-table-column>
      <el-table-column v-if="has_permission('account_user_edit|account_user_disable')" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="instDetail(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination-bar" v-if="tableData.total > 10">
      <el-pagination :page-size="10"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"  layout="total, prev, pager, next"
                     :total="tableData.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import sqlFormatter from 'sql-formatter'
  import SqlEditor from '../common/SqlEditor'
  export default {
    components:{
      SqlEditor
    },
    data () {
      return {
        filters: {
          inst_name: '',
          apply_time: '',
          apply_user:'',
          app:'',
          exec_user:'',
        },
        tableData:{
          data:[
            {apply_user:'张三',inst_name:'zjport',inst_apps:'易豹',sql_status:'等待执行',exec_user:'',apply_time:'2021-08-20 21:31:34'},
            {apply_user:'张三',inst_name:'zjport',inst_apps:'易豹',sql_status:'执行成功',exec_user:'李四2',apply_time:'2021-08-20 21:31:34'},
            {apply_user:'张三',inst_name:'zjport',inst_apps:'易豹',sql_status:'执行失败',exec_user:'李四3',apply_time:'2021-08-20 21:31:34'},
            {apply_user:'张三',inst_name:'zjport',inst_apps:'易豹',sql_status:'执行中',exec_user:'李四4',apply_time:'2021-08-20 21:31:34'},
          ],
          total:20
        },
        listLoading:false,
        currentPage: 1,
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUsers(this.currentPage);
      },
      //显示SQL申请界面
      handleAdd: function () {
        this.$router.push('/devops/sqlapp')
      },
      addSubmit: function () {

      },
    }
  }
</script>

<style scoped>
</style>
