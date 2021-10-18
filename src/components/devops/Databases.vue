<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item label="IP：">
            <el-input v-model="filters.IP" placeholder="ip"></el-input>
          </el-form-item>
          <el-form-item label="实例名：">
            <el-input v-model="filters.inst_name" placeholder="实例名"></el-input>
          </el-form-item>
          <el-form-item label="库名：">
            <el-input v-model="filters.db_name" placeholder="库名"></el-input>
          </el-form-item>
          <el-form-item label="应用：">
            <el-input v-model="filters.app" placeholder="应用"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" style="text-align: right">
        <el-button @click="refresh()">刷新</el-button>
        <el-button v-if="has_permission('account_user_add')" style="float: right" type="primary"
                   @click="handleAdd()">新建库
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="ip" label="IP" sortable></el-table-column>
      <el-table-column prop="inst_name" label="实例名" sortable></el-table-column>
      <el-table-column prop="db_name" label="库名" sortable></el-table-column>
      <el-table-column prop="app" label="应用" sortable></el-table-column>
      <el-table-column prop="create_user" label="创建人" sortable></el-table-column>
      <el-table-column prop="create_time" label="创建时间" sortable width="160px"></el-table-column>
      <el-table-column v-if="has_permission('account_user_edit|account_user_disable')" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="instDetail(scope.row.id)">详情</el-button>
          <el-button type="info" size="small" @click="instEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="instDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    分页-->
    <div class="pagination-bar" v-if="tableData.total > 10">
      <el-pagination :page-size="10"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"  layout="total, prev, pager, next"
                     :total="tableData.total">
      </el-pagination>
    </div>

    <!--编辑用户申请界面-->
    <el-dialog :title="addFormTitle" visible v-if="dialogShow" @close="dialogShow = false"
               :close-on-click-modal="false" width="60%" append-to-body>
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="135px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据库连接地址：" prop="con_address" required >
              <el-select v-model="addForm.con_address" placeholder="请选择连接地址">
                <el-option
                  v-for="item in con_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="db_name" label="库名：" required>
              <el-input placeholder="请输入" v-model="addForm.db_name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"
                  show-icon></el-alert>
      </el-form>
      <div slot="footer">
        <el-button type="text" @click.native="dialogShow = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="addSubmit">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        filters: {},
        listLoading:false,
        currentPage: 1,
        tableData:{
          data:[
            {ip:'192.168.8.152',inst_name:'db01',db_name:'user01',app:'易豹',create_user:'test01',create_time:'2021-08-01 13:20:30'},
            {ip:'192.168.8.153',inst_name:'db02',db_name:'user03',app:'易豹',create_user:'test01',create_time:'2021-08-01 13:20:30'},
          ],
          total:20
        },
        error:'',
        addFormTitle:'',
        dialogShow:false,
        addLoading:false,
        addForm:{
          con_address: '',
          db_name:'',
        },
        con_list:[
          {value: '192.168.8.152:3306', label: '192.168.8.152:3306'},
          {value: '192.168.8.153:3306', label: '192.168.8.153:3306'},
        ],
        rules:{
          con_address: [
            {required: true, message: '请选择数据库连接地址', trigger: 'blur'}
          ],
          db_name: [
            {required: true, message: '请输入库名', trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUsers(this.currentPage);
      },
      handleAdd(){
        this.addFormTitle = '新建库',
          this.error = '',
          this.dialogShow = true
      }
    }
  }
</script>

<style scoped>

</style>
