<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="filters">
          <el-form-item label="实例名：">
            <el-input v-model="filters.inst_name" placeholder="实例名"></el-input>
          </el-form-item>
          <el-form-item label="实例类型：">
            <el-select v-model="filters.inst_type" placeholder="请选择">
              <el-option v-for="item in inst_type_options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP：">
            <el-input v-model="filters.inst_ip" placeholder="ip"></el-input>
          </el-form-item>
          <el-form-item label="所属应用：">
            <el-input v-model="filters.inst_apps" placeholder="所属应用"></el-input>
          </el-form-item>
          <el-form-item label="实例状态：">
            <el-select v-model="filters.db_status" placeholder="请选择">
              <el-option label="Running" value="Running">
              </el-option>
              <el-option label="Stop" value="Stop">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="getInstances(1)">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button style="float: right" type="primary"
                   @click="handleAdd()">添加实例
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="inst_ip" label="ip" sortable width="140"></el-table-column>
      <el-table-column prop="inst_name" label="实例名" sortable width="120"></el-table-column>
      <el-table-column prop="inst_type" label="实例类型" sortable width="120"></el-table-column>
      <el-table-column prop="db_status" label="状态" sortable width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.db_status == 'Running' ? 'success' : 'danger'" size="small">
            {{ scope.row.db_status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="db_role" label="角色" sortable width="90"></el-table-column>
      <el-table-column prop="is_cluster" label="是否集群" width="90"></el-table-column>
      <el-table-column prop="apps" label="应用"></el-table-column>
      <el-table-column prop="db_version" label="版本"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
<!--          <el-button v-if="has_permission('account_user_edit')" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
<!--          <el-button v-if="has_permission('account_user_disable') && scope.row.is_active" size="small"-->
<!--                     type="danger" :loading="btnDelLoading[scope.row.id]" @click="handleDisable(scope.$index, scope.row)">禁用-->
<!--          </el-button>-->
<!--          <el-button  v-if="has_permission('account_user_disable') && scope.row.is_active != 1" size="small"-->
<!--                      type="success" :loading="btnDelLoading[scope.row.id]" @click="handleDisable(scope.$index, scope.row)">启用-->
<!--          </el-button>-->
<!--          <el-button v-if="has_permission('account_user_disable')" size="small" type="warning" @click="RestPwd(scope.$index, scope.row)">重置密码-->
<!--          </el-button>-->
          <el-button type="primary" size="small" @click="instDetail(scope.row.id,scope.row.inst_type)">详情</el-button>
          <el-button type="info" size="small" @click="instEdit(scope.row.id)">编辑</el-button>
          <el-button type="danger" size="small" @click="instDelete(scope.row.id ,scope.row.inst_ip)">删除</el-button>
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


    <!--新增实例界面-->
    <el-dialog :title="addFormTitle" visible v-if="dialogShow" @close="dialogShow = false"
               :close-on-click-modal="false" width="70%">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="80px">
        <el-form-item prop="inst_type" label="实例类型" required>
          <el-select v-model="addForm.inst_type" placeholder="请选择" @change="changeShh_con">
            <el-option v-for="item in inst_type_options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="inst_ip" label="实例IP" required>
          <el-input placeholder="请输入" v-model="addForm.inst_ip" auto-complete="off" :disabled="is_disabled"></el-input>
        </el-form-item>
        <el-form-item prop="inst_name" label="实例名">
          <el-input placeholder="请输入" v-model="addForm.inst_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="apps" label="所属应用" required>
          <el-input placeholder="请输入" v-model="addForm.apps" auto-complete="off"></el-input>
        </el-form-item>
        <div>
        <el-form-item prop="ssh_con" label="SSH连接">
          <el-col :span="8">
            <el-input :disabled=isNeed v-model="addForm.ssh_user">
              <template style="width:30px;" slot="prepend">user</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input :disabled="true" v-model="addForm.inst_ip">
              <template slot="prepend">ip</template>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-input :disabled=isNeed v-model="addForm.ssh_port">
              <template slot="prepend">port</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="SSH密码" :prop=ssh_pw>
          <el-input :disabled=isNeed v-model="addForm.ssh_password" show-password></el-input>
        </el-form-item>
        </div>
        <el-form-item prop="db_con" label="DB连接">
          <el-col :span="5">
            <el-input placeholder="请输入" v-model="addForm.db_user" auto-complete="off">
              <template slot="prepend">user</template>
            </el-input>
          </el-col>
          <el-col :span="7">
            <el-input :disabled="true" v-model="addForm.inst_ip">
              <template slot="prepend">ip</template>
            </el-input>
          </el-col>
          <el-col :span="5">
            <el-input placeholder="请输入" v-model="addForm.db_port">
              <template slot="prepend">port</template>
            </el-input>
          </el-col>
          <el-col :span="7">
            <el-input :disabled="true" v-model="addForm.inst_name">
              <template slot="prepend">name</template>
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="DB密码" prop="db_password" required>
          <el-input v-model="addForm.db_password" show-password></el-input>
        </el-form-item>
<!--        <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"-->
<!--                  show-icon></el-alert>-->
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
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.addForm.checkPass !== '') {
            this.$refs.addForm.validateField('checkPass');
          }
          callback();
        }
      };

      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      let checkMobile = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('手机号不能为空'));
        }
        setTimeout(() => {
          let mobile = /^1[34578]\d{9}$/;
          if (!mobile.test(value)) {
            callback(new Error('手机号不正确'));
          } else {
            callback();
          }
        }, 1000);
      };

      return {
        isNeed:false,
        ssh_pw:'ssh_password',
        filters: {
          inst_name: '',
          inst_type: '',
          inst_ip: '',
          inst_apps: '',
          inst_status: '',
          page:1,
        },
        inst_type_options:[
          {label:'Oracle',value:'Oracle'},
          {label:'Mysql',value:'Mysql'},
          {label:'Rds',value:'Rds'},
        ],
        dialogShow: false,
        tableData: {data:[],
          total:0
        },
        display: '',
        listLoading: false,
        addFormTitle: '',
        addLoading: false,
        is_disabled: '',
        currentPage: 1,
        addForm: {
          inst_ip: '',
          inst_name: '',
          db_user: '',
          db_password: '',
          db_port:'',
          ssh_user: '',
          ssh_password: '',
          ssh_port:'',
          inst_type:'',
          apps:'',
        },
        rules: {
          inst_ip: [
            {required: true, message: '请输入ip', trigger: 'blur'}
          ],
          inst_name: [
            {required: true, message: '请输入实例名', trigger: 'blur'}
          ],
          inst_type: [
            {required: true, message: '请选择实例类型', trigger: 'blur'}
          ],
          apps: [
            {required: true, message: '请输入所属应用', trigger: 'blur'}
          ],
          ssh_password: [
            {required: true, message: '请输入主机连接密码', trigger: 'blur'},
            // {validator: validatePass, trigger: 'blur'}
          ],
          db_password: [
            {required: true, message: '请输入数据库连接密码', trigger: 'blur'},
            // {validator: validatePass, trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      //根据添加实例类型改变添加表单
      changeShh_con() {
        if (this.addForm.inst_type=='Rds'){
          this.isNeed = true
          this.ssh_pw = ''
        }else{
          this.isNeed = false
          this.ssh_pw = 'ssh_password'
        }
      },

      //获取实例列表
      getInstances(page) {
        this.listLoading = true;
        this.filters.page = page;
        this.$http.post('/api/inst/getinstances/',this.filters).then(res => {
          this.tableData = res.result
        }, response => {
          this.error = response.result
        }).finally(() => this.listLoading = false)
      },

      //添加实例
      addSubmit() {
        this.$refs.addForm.validate((valid) =>{
          if (valid) {
            this.addLoading=true;
            this.$http.post('/api/inst/addinstance/',this.addForm).then(res => {
              this.addLoading = false;
              this.dialogShow = false;
              this.$layer_message(res.result, 'success');
              this.getInstances(1)
            }, response => {
              this.addLoading = false;
              this.$layer_message(response.result);
            }).finally(() => {
            }).catch((e) => {})
          }
        })
      },

      //换页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getInstances(this.currentPage);
      },

      //显示添加界面
      handleAdd: function () {
        this.is_disabled = false;
        this.dialogShow = true;
        this.addFormTitle = '添加实例';
        this.display = 'display:block';
      },

      //删除实例
      instDelete(instId ,instIp){
        this.$confirm('删除'+ instIp + '实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          this.$http.get('/api/inst/deleteinstance/', {
            params: {
              id: instId
            }
          }).then((res) => {
            this.$message({type: 'success',message: '删除成功!'});
            this.getInstances()
          }, (response) =>
            this.$message({type: 'error',message: '删除失败，原因：' + response.result}),
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      //编辑实例
      instEdit(instId){
        this.is_disabled = true;
        this.dialogShow = true;
        this.addFormTitle = '编辑实例';
        this.display = 'display:none';
      },

      //实例详情
      instDetail(instId ,instType){
        if (instType=='Oracle'){
          var detailtUrl = this.$router.resolve({
            path:"/detail/inst/oradetail", query:{instId: instId}
          })
        }else{
          var detailtUrl = this.$router.resolve({
            path:"/detail/inst/mysqldetail", query:{instId: instId}
          })
        }
        window.open(detailtUrl.href)
      },

      //重置密码
      RestPwd: function (index, row) {
        this.$confirm('确认重置吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          this.editForm = row;
          this.editForm.password = 'Password';
          this.EditData(row, '默认密码: ', 'Password');
        }).catch(() => {
        });
      },

      EditData: function (row, msg, pwd) {
        this.$http.put(`/api/account/users/${row.id}`, this.editForm).then(response => {
          this.listLoading = false;
          this.$layer_message(msg + pwd, 'success');
          this.getUsers(this.currentPage);
        }, response => this.$layer_message(response.result)).finally(() => this.btnDelLoading = {});
      },

      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.editLoading = true;
            this.error = '';
            if (this.editForm.id) {
              this.$http.put(`/api/account/users/${this.editForm.id}`, this.editForm).then(this.resp,
                response => this.$layer_message(response.result)).finally(() => this.editLoading = false)
            } else {
              this.$http.post('/api/account/users/', this.editForm).then(this.resp,
                response => this.$layer_message(response.result)).finally(() => this.editLoading = false)
            }
          }
        });
      },
      resp: function (response) {
        this.editLoading = false;
        this.$layer_message('提交成功', 'success');
        this.editForm = {};
        this.addForm = {role_id: ''};
        this.dialogShow = false;
        this.getUsers(this.currentPage);
      }
    },
    mounted() {
      this.getInstances()
    }
  }
</script>

<style scoped>

</style>
