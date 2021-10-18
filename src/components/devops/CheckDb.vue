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
          <el-form-item label="巡检时间：">
            <el-date-picker type="date" placeholder="选择日期" v-model="filters.check_time" style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" style="text-align: right">
        <el-button @click="refresh()">刷新</el-button>
        <el-button v-if="has_permission('account_user_add')" style="float: right" type="primary"
                   @click="handleAdd()">新增巡检
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="ip" label="IP" sortable></el-table-column>
      <el-table-column prop="inst_name" label="实例名" sortable></el-table-column>
      <el-table-column prop="check_time" label="巡检时间" sortable width="160px"></el-table-column>
      <el-table-column v-if="has_permission('account_user_edit|account_user_disable')" label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="instDetail(scope.row.id)">详情</el-button>
          <el-button type="warning" size="small">下载</el-button>
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
              <el-select v-model="addForm.ip" placeholder="请选择连接地址">
                <el-option
                  v-for="item in ip_list"
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
            {ip:'192.168.8.152',inst_name:'db01',check_time:'2021-08-01 13:20:30'},
            {ip:'192.168.8.153',inst_name:'db02',check_time:'2021-08-01 13:20:30'},
          ],
          total:20
        },
        error:'',
        addFormTitle:'',
        dialogShow:false,
        addLoading:false,
        addForm:{
          ip: '',
          db_name:'',
        },
        ip_list:[
          {value: '192.168.8.152', label: '192.168.8.152'},
          {value: '192.168.8.153', label: '192.168.8.153'},
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
        this.addFormTitle = '新增巡检',
          this.error = '',
          this.dialogShow = true
      }
    }
  }
</script>

<style scoped>

</style>
