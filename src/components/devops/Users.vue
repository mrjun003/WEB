<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item label="IP：">
            <el-input v-model="filters.IP" placeholder="ip"></el-input>
          </el-form-item>
          <el-form-item label="用户：">
            <el-input v-model="filters.user" placeholder="用户"></el-input>
          </el-form-item>
          <el-form-item label="实例名：">
            <el-input v-model="filters.inst_name" placeholder="实例名"></el-input>
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
                   @click="handleAdd()">添加用户
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="ip" label="IP" sortable></el-table-column>
      <el-table-column prop="inst_name" label="实例名" sortable></el-table-column>
      <el-table-column prop="user" label="用户名" sortable></el-table-column>
      <el-table-column prop="app" label="应用" sortable></el-table-column>
      <el-table-column prop="status" label="状态" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 'UNLOCK' ? 'success' : 'danger'" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
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
              <el-select v-model="addForm.con_address" placeholder="请选择">
                <el-option label="192.168.8.152:3306" value="192.168.8.152:3306">
                </el-option>
                <el-option label="192.168.8.153:3306" value="192.168.8.153:3306">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="数据库：" prop="db_name" required>-->
<!--              <el-select v-model="addForm.db_name" placeholder="请选择">-->
<!--                <el-option label="db01" value="db01">-->
<!--                </el-option>-->
<!--                <el-option label="db02" value="db02">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="user" label="用户：" required>
              <el-input placeholder="请输入" v-model="addForm.user" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password" label="密码：" required>
              <el-input v-model="addForm.password" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="password2" label="再次输入密码：" required>
              <el-input v-model="addForm.password2" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="grant" label="权限：">
              <el-radio-group v-model="addForm.grant">
                <el-radio label="只读权限"></el-radio>
                <el-radio label="应用权限"></el-radio>
                <el-radio label="超级权限"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="dbs" label="授权数据库：" required>
              <el-transfer v-model="addForm.dbs" :data="all_dbs"></el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="roles" label="角色：">
              <el-transfer v-model="addForm.roles" :data="all_roles"></el-transfer>
            </el-form-item>
          </el-col>
        </el-row>
        <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"
                  show-icon></el-alert>
      </el-form>
      <div slot="footer">
        <el-button type="text" @click.native="dialogShow = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">保存</el-button>
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
            {ip:'192.168.8.152',inst_name:'db01',user:'user01',app:'易豹',status:'UNLOCK',create_user:'test01',create_time:'2021-08-01 13:20:30'},
            {ip:'192.168.8.153',inst_name:'db02',user:'user03',app:'易豹',status:'LOCK',create_user:'test01',create_time:'2021-08-01 13:20:30'},
          ],
          total:20
        },
        error:'',
        addFormTitle:'',
        dialogShow:false,
        addForm:{
          user:'',
          password:'',
          password2:'',
          grant:'只读权限',
          dbs:[],
          roles:[],
        },
        all_roles:[
          {
            key: 'dba', label: 'dba', disabled: false
          },{
            key: 'read_only', label: 'read_only', disabled: false
          },
        ],
        all_dbs:[
          {
            key: 'db01', label: 'db01', disabled: false
          },{
            key: 'db02', label: 'db02', disabled: false
          },{
            key: 'db03', label: 'db03', disabled: false
          },{
            key: 'db04', label: 'db04', disabled: false
          },{
            key: 'db05', label: 'db05', disabled: false
          },
        ],
        con_list:[
          {value: '192.168.8.152:3306', label: '192.168.8.152:3306'},
          {value: '192.168.8.153:3306', label: '192.168.8.153:3306'},
        ],
        rules:{
          con_address: [
            {required: true, message: '请选择数据库连接地址', trigger: 'blur'}
          ],
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          dbs: [
            {required: true, message: '请选择授权数据库', trigger: 'blur'}
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
        this.addFormTitle = '添加用户',
        this.error = '',
        this.dialogShow = true
      }
    }
  }
</script>

<style scoped>

</style>
