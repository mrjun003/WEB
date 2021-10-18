<template>
  <div>
    <el-tabs v-model="activeName" tab-position="top" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="info">
        <OraInfo :instId="this.instId" ref="orainfo"></OraInfo>
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <el-row>
          <el-col>
            <el-button style="float: right;" type="primary" @click="userAdd()">创建用户
            </el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-divider><span class="span">用户详情</span></el-divider>
          <el-col :span="24">
            <el-table :data="userTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="username" label="用户名" ></el-table-column>
              <el-table-column prop="account_status" label="用户状态" >
                <template slot-scope="scope">
                  <el-tag :type="scope.row.account_status == 'OPEN' ? 'success' : 'danger'" size="small">
                    {{ scope.row.account_status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="lock_date" label="上锁时间" ></el-table-column>
              <el-table-column prop="expiry_date" label="过期时间" ></el-table-column>
              <el-table-column prop="default_tablespace" label="默认表空间"></el-table-column>
              <el-table-column prop="created" label="创建时间"></el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="instDetail(scope.row.id,scope.row.inst_type)">详情</el-button>
                  <el-button type="danger" size="small" @click="instDelete(scope.row.id ,scope.row.inst_ip)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>

        <!--新增用户界面-->
        <el-dialog title="创建用户" visible v-if="dialogUserShow" @close="dialogUserShow = false"
                   :close-on-click-modal="false" width="60%" append-to-body>
          <el-form ref="addForm" :model="addUserForm" :rules="rules" label-width="135px">
            <el-row>
              <el-col :span="8">
                <el-form-item prop="user" label="用户：" required>
                  <el-input placeholder="请输入" v-model="addUserForm.user" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="password" label="密码：" required>
                  <el-input v-model="addUserForm.password" show-password></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="password2" label="再次输入密码：" required>
                  <el-input v-model="addUserForm.password2" show-password></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <el-form-item prop="grant" label="权限：">
                  <el-radio-group v-model="addUserForm.grant">
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
                  <el-transfer v-model="addUserForm.dbs" :data="all_dbs"></el-transfer>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="roles" label="角色：">
                  <el-transfer v-model="addUserForm.roles" :data="all_roles"></el-transfer>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer">
            <el-button type="text" @click.native="dialogUserShow = false">取消</el-button>
            <el-button type="primary" :loading="addUserLoading" @click.native="addUser()">保存</el-button>
          </div>
          </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="会话统计" name="session">
        <el-row>
          <el-divider><span class="span">活跃会话统计</span></el-divider>
          <el-row>
            <el-col :span="5">
              <el-button @click="reflashClick">{{ clickText }}</el-button>
              <el-button style="float: right;margin-bottom: 10px;" type="danger" @click="killSession()">kill选中会话
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table ref="sessionMultipleTable" :data="sessionTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
                <el-table-column type="selection" width="60"></el-table-column>
                <el-table-column prop="sid" label="sid" ></el-table-column>
                <el-table-column prop="serial" label="serial#" ></el-table-column>
                <el-table-column prop="username" label="username" ></el-table-column>
                <el-table-column prop="status" label="status"></el-table-column>
                <el-table-column prop="machine" label="machine"></el-table-column>
                <el-table-column prop="sql_id" label="sql_id"></el-table-column>
                <el-table-column prop="sql_child_number" label="sql_child_number"></el-table-column>
                <el-table-column prop="row_wait_obj#" label="row_wait_obj#"></el-table-column>
                <el-table-column prop="event" label="event"></el-table-column>
                <el-table-column prop="last_call_et" label="last_call_et"></el-table-column>
                <el-table-column prop="sql_text" label="sql_text"></el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-divider ><span class="span">会话连接数统计</span></el-divider>
            <el-table :data="connTableData" show-summary stripe border
                      v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="username" label="username" ></el-table-column>
              <el-table-column prop="machine" label="machine"></el-table-column>
              <el-table-column prop="status" label="status"></el-table-column>
              <el-table-column prop="cnt" label="连接数" width="80px"></el-table-column>
            </el-table>
          </el-col>
          <el-col :span="10" style="margin-left: 15px">
            <el-divider ><span class="span">会话连接使用情况</span></el-divider>
            <el-table :data="resourceSessionTableData" stripe border
                      v-loading="listLoading" style="width: 100%">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="name" label="name" ></el-table-column>
              <el-table-column prop="current" label="当前连接数"></el-table-column>
              <el-table-column prop="max" label="最大使用连接数"></el-table-column>
              <el-table-column prop="init" label="可分配连接数"></el-table-column>
              <el-table-column prop="limit" label="最大连接数"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="锁查看" name="lock">
        <el-row>
          <el-divider ><span class="span">锁等待</span></el-divider>
          <el-col :span="24">
            <el-table :data="lockTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="40"></el-table-column>
              <el-table-column prop="sid" label="sid" ></el-table-column>
              <el-table-column prop="serial#" label="serial#" ></el-table-column>
              <el-table-column prop="username" label="username"></el-table-column>
              <el-table-column prop="machine" label="machine"></el-table-column>
              <el-table-column prop="status" label="status"></el-table-column>
              <el-table-column prop="sql_id" label="sql_id"></el-table-column>
              <el-table-column prop="owner" label="owner"></el-table-column>
              <el-table-column prop="object_name" label="object_name"></el-table-column>
              <el-table-column prop="locked_mode" label="locked_mode"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-divider ><span class="span">会话阻塞</span></el-divider>
          <el-col :span="24">
            <el-table :data="blockTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="40"></el-table-column>
              <el-table-column prop="sid" label="被阻塞会话" ></el-table-column>
              <el-table-column prop="sess_serial#" label="sess_serial#" ></el-table-column>
              <el-table-column prop="wait_id" label="wait_id"></el-table-column>
              <el-table-column prop="wait_event" label="wait_event"></el-table-column>
              <el-table-column prop="wait_event_text" label="wait_event_text"></el-table-column>
              <el-table-column prop="blocker_instance_id" label="造成阻塞会话实例"></el-table-column>
              <el-table-column prop="blocker_sid" label="造成阻塞会话"></el-table-column>
              <el-table-column prop="blocker_sess_serial#" label="blocker_sess_serial#"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="表空间查看" name="tablespace">
        <el-row>
          <el-col>
            <el-button style="float: right;margin-bottom: 10px" type="primary"
                       @click="dialogTablespaceShow = true" :disabled="db_role=='PRIMARY' ? false:true">新建表空间
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-divider ><span class="span">表空间使用情况</span></el-divider>
          <el-col :span="24">
            <el-table :data="tablespaceTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="40"></el-table-column>
              <el-table-column prop="tablespace_name" label="表空间名" ></el-table-column>
              <el-table-column prop="total_gb" label="总大小（GB）" ></el-table-column>
              <el-table-column prop="used_gb" label="使用大小（GB）"></el-table-column>
              <el-table-column prop="free_gb" label="剩余大小（GB）">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.used_pct > 90 && scope.row.free_gb < 10 ?  'danger' : 'success'" size="small">
                    {{ scope.row.free_gb }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="used_pct" label="使用率（%）">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.used_pct > 90 && scope.row.free_gb < 10 ?  'danger' : 'success'" size="small">
                    {{ scope.row.used_pct }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" with="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="">使用详情</el-button>
                  <el-button type="danger" size="small" @click="" :disabled="db_role=='PRIMARY' ? false:true">扩展</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="对象统计" name="object">
        <el-row>
          <el-col :span="15">
            <el-divider ><span class="span">占用空间前30的对象</span></el-divider>
            <el-table :data="segmentTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="owner" label="用户" ></el-table-column>
              <el-table-column prop="segment_name" label="对象名" ></el-table-column>
              <el-table-column prop="segment_type" label="对象类型"></el-table-column>
              <el-table-column prop="size" label="对象大小（GB）" width="140px">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.size >= 10 ?  'danger' : 'success'" size="small">
                    {{ scope.row.size }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="8" style="margin-left: 15px">
            <el-divider ><span class="span">各用户占用空间大小</span></el-divider>
            <el-table :data="usersegmentTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="user" label="用户" ></el-table-column>
              <el-table-column prop="size" label="使用大小（GB）" width="140px"></el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row>
          <el-divider ><span class="span">分区表统计</span></el-divider>
          <el-table :data="parttableTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
                <el-table-column type="index" width="60"></el-table-column>
                <el-table-column prop="table_owner" label="用户" ></el-table-column>
                <el-table-column prop="table_name" label="表名" ></el-table-column>
                <el-table-column prop="parttion_name" label="表分区名"></el-table-column>
                <el-table-column prop="high_value" label="分区最大值"></el-table-column>
                <el-table-column prop="partition_position" label="分区位"></el-table-column>
              </el-table>
        </el-row>
        <el-row>
          <el-divider ><span class="span">表碎片率高于70%</span></el-divider>
          <el-table :data="tabChipTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="owner" label="用户" ></el-table-column>
            <el-table-column prop="table_name" label="表名" ></el-table-column>
            <el-table-column prop="theory_size" label="理论大小（MB）"></el-table-column>
            <el-table-column prop="true_size" label="实际大小（MB）"></el-table-column>
            <el-table-column prop="used_pct" label="使用率（%）"></el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="统计信息" name="statics">
        <el-row>
          <el-divider ><span class="span">统计信息失效表</span></el-divider>
          <el-table :data="tablestaticsTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="owner" label="用户" ></el-table-column>
            <el-table-column prop="table_name" label="表名" ></el-table-column>
            <el-table-column prop="object_type" label="表类型"></el-table-column>
            <el-table-column prop="last_analyzed" label="最后收集时间"></el-table-column>
            <el-table-column prop="stale_stats" label="是否过期"></el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-divider ><span class="span">统计信息失效索引</span></el-divider>
          <el-table :data="indexstaticsTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="owner" label="用户" ></el-table-column>
            <el-table-column prop="index_name" label="索引名" ></el-table-column>
            <el-table-column prop="table_owner" label="表用户"></el-table-column>
            <el-table-column prop="table_name" label="表名"></el-table-column>
            <el-table-column prop="last_analyzed" label="最后收集时间"></el-table-column>
            <el-table-column prop="stale_stats" label="是否过期"></el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-divider ><span class="span">失效原因</span></el-divider>
          <el-table :data="stalereasondataTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="60"></el-table-column>
            <el-table-column prop="table_owner" label="表用户"></el-table-column>
            <el-table-column prop="table_name" label="表名"></el-table-column>
            <el-table-column prop="inserts" label="插入数"></el-table-column>
            <el-table-column prop="updates" label="更新数"></el-table-column>
            <el-table-column prop="deletes" label="删除数"></el-table-column>
            <el-table-column prop="timestamp" label="截至时间"></el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="归档统计" name="archive">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-divider ><span class="span">最近7天归档统计</span></el-divider>
              <el-table :data="daylyArchiveTableData" stripe border v-loading="listLoading"
                        style="width: 100%">
                <el-table-column type="index" width="40"></el-table-column>
                <el-table-column prop="day" label="日期"></el-table-column>
                <el-table-column prop="size" label="归档大小（GB）"></el-table-column>
              </el-table>
            </el-row>
          </el-col>
          <el-col :span="11" style="margin-left: 15px;">
            <el-row>
              <el-divider ><span class="span">最近48小时归档统计</span></el-divider>
              <el-table :data="hourlyArchiveTableData" stripe border v-loading="listLoading"
                        style="width: 100%" max-height="500">
                <el-table-column type="index" width="40"></el-table-column>
                <el-table-column prop="hour" label="时间"></el-table-column>
                <el-table-column prop="size" label="归档大小（GB）"></el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="慢sql" name="slow">
        <el-row>
          <el-divider ><span class="span">执行时长前20的sql</span></el-divider>
          <el-table :data="currentDaySlowTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="username" label="用户" ></el-table-column>
            <el-table-column prop="sql_id" label="sql_id" ></el-table-column>
            <el-table-column prop="execs" label="执行次数"></el-table-column>
            <el-table-column prop="exec_time" label="执行时长"></el-table-column>
            <el-table-column prop="last_time" label="最后执行时间"></el-table-column>
            <el-table-column prop="module" label="module"></el-table-column>
            <el-table-column prop="cost" label="cost"></el-table-column>
            <el-table-column prop="sorts" label="sorts"></el-table-column>
            <el-table-column prop="prb" label="物理读（Bytes）"></el-table-column>
            <el-table-column prop="pwr" label="物理写"></el-table-column>
            <el-table-column prop="dr" label="直接路径读"></el-table-column>
            <el-table-column prop="dw" label="直接路径写"></el-table-column>
            <el-table-column prop="rrows" label="返回行数"></el-table-column>
            <el-table-column prop="sql" label="sql"></el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="rman备份" name="rman">
        <el-row>
          <el-divider ><span class="span">最近15次rman备份</span></el-divider>
          <el-table :data="rmanTableData" stripe border v-loading="listLoading" style="width: 100%" max-height="500">
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="start_time" label="备份开始时间" ></el-table-column>
            <el-table-column prop="end_time" label="备份结束时间" ></el-table-column>
            <el-table-column prop="input" label="备份输入大小（GB）"></el-table-column>
            <el-table-column prop="output" label="备份输出大小（GB）"></el-table-column>
            <el-table-column prop="status" label="备份状态"></el-table-column>
            <el-table-column prop="runtime" label="备份运行时长"></el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!--sql执行提示界面-->
    <el-dialog title="提示" visible v-if="dialogExecSqlShow" @close="dialogExecSqlShow = false"
               :close-on-click-modal="false" width="50%" append-to-body>
      <div v-html="execSql"></div>
      <div slot="footer" style="text-align: center">
        <el-button type="text" @click.native="dialogExecSqlShow = false">取消</el-button>
        <el-button type="primary" v-clipboard:copy="execSql.replaceAll('<br/>','\n')"
                   v-clipboard:success="onCopy"
                   v-clipboard:error="onError">复制
        </el-button>
        <el-button type="danger" @click.native="">直接执行</el-button>
      </div>
    </el-dialog>

    <!--新建表空间界面-->
    <el-dialog title="新建表空间" visible v-if="dialogTablespaceShow" @close="dialogTablespaceShow = false"
               :close-on-click-modal="false" width="50%" append-to-body>
      <el-form ref="addTablespaceForm" :model="addTablespaceForm" :rules="rules" label-width="135px">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="tablespace_type" label="表空间类型" required>
              <el-select v-model="addTablespaceForm.tablespace_type" placeholder="请选择">
                <el-option label="Normal" value="Normal"></el-option>
                <el-option label="Temp" value="Temp"></el-option>
                <el-option label="Undo" value="Undo"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="tablespace_name" label="表空间名：" required>
              <el-input v-model="addTablespaceForm.tablespace_name" auto-complete="off">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item prop="file_name" label="文件名：">
              <el-input v-model="addTablespaceForm.file_name" auto-complete="off" :disabled="is_cluster">
                <template slot="prepend">{{ defaultFileDirectory }}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="size" label="文件初始大小：" required>
              <el-input placeholder="最大32" v-model="addTablespaceForm.size">
                <template slot="append">GB</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="autoextend" label="是否自动扩展：">
              <el-radio-group v-model="addTablespaceForm.autoextend">
                <el-radio label="off"></el-radio>
                <el-radio label="on"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="text" @click.native="dialogTablespaceShow = false">取消</el-button>
        <el-button type="primary" :loading="addUserLoading" @click.native="tablespaceAdd()">生成SQL</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import OraInfo from './OraInfo.vue'
  export default {
    components:{OraInfo},
    data(){
      return{
        instId:this.$route.query.instId,
        activeName: 'info',
        is_cluster: true,
        db_role: 'PRIMARY',
        dialogExecSqlShow: false,
        execSql: '',
        status:false,
        clickText:'5秒自动刷新',

        listLoading: false,

        userTableData: [],
        addUserForm:{},
        addUserLoading:false,
        dialogUserShow:false,

        sessionTableData: [],
        connTableData: [],
        resourceSessionTableData: [],

        lockTableData: [],
        blockTableData: [],

        tablespaceTableData: [],
        addTablespaceForm: {
          tablespace_type: 'Normal',
          tablespace_name: '',
          file_name: '',
          autoextend: 'off',
        },
        dialogTablespaceShow: false,
        defaultFileDirectory: '',

        segmentTableData: [],
        usersegmentTableData: [],
        parttableTableData: [],
        tabChipTableData: [],

        tablestaticsTableData: [],
        indexstaticsTableData: [],
        stalereasondataTableData: [],

        daylyArchiveTableData: [],
        hourlyArchiveTableData: [],

        currentDaySlowTableData: [],

        rmanTableData: [],
      };
    },
    methods: {
      handleClick(tab, event) {
        this.$refs.orainfo.getDatabaseInfo();
        this.getInfo(this.instId, this.activeName)
      },
      getInfo(instId ,tab ) {
        if(tab=='user'){this.userTableData = []}
        else if (tab=='session'){
          this.sessionTableData = [];
          this.connTableData = [];
          this.resourceSessionTableData = [];
        }else if (tab=='lock'){
          this.lockTableData = [];
          this.blockTableData = [];
        }else if (tab=='tablespace'){
          this.tablespaceTableData = [];
        }else if (tab=='object'){
          this.segmentTableData = [];
          this.parttableTableData = [];
          this.tabChipTableData = [];
          this.usersegmentTableData = [];
        }else if (tab=='statics'){
          this.tablestaticsTableData = [];
          this.indexstaticsTableData = [];
          this.stalereasondataTableData = [];
        }else if (tab=='archive'){
          this.daylyArchiveTableData = [];
          this.hourlyArchiveTableData = [];
        }else if (tab=='slow'){
          this.currentDaySlowTableData = [];
        }else if (tab=='rman'){
          this.rmanTableData = [];
        }
        this.listLoading = true
        this.$http.get('/api/inst/getinfo/', {
          params: {
            id: instId,
            tab: tab,
          },
          _timeout:1000,
        }).then((res) => {
          if(tab=='user'){this.userTableData = res.result.userdata}
          else if (tab=='session'){
            this.sessionTableData = res.result.activedata;
            this.connTableData = res.result.conndata;
            this.resourceSessionTableData = res.result.resourcesessiondata
          }else if (tab=='lock'){
            this.lockTableData = res.result.lockdata;
            this.blockTableData = res.result.blockdata;
          }else if (tab=='tablespace'){
            this.tablespaceTableData = res.result.useddata;
          }else if (tab=='object'){
            this.segmentTableData = res.result.segmentdata;
            this.parttableTableData = res.result.parttabledata;
            this.usersegmentTableData = res.result.usersegmentdata;
              this.tabChipTableData = res.result.tabchipdata;
          }else if (tab=='statics'){
            this.tablestaticsTableData = res.result.tablestaticsdata;
            this.indexstaticsTableData = res.result.indexstaticsdata;
            this.stalereasondataTableData = res.result.stalereasondata
          }else if (tab=='archive'){
            this.daylyArchiveTableData = res.result.daylyarchivedata;
            this.hourlyArchiveTableData = res.result.hourlyarchivedata
          }else if (tab=='slow'){
            this.currentDaySlowTableData = res.result.currentdayslowdata;
          }else if (tab=='rman'){
            this.rmanTableData = res.result.rmandata;
          }
          }, (response) => {
          this.$message({type: 'error',message: '获取信息失败，原因：' + response.result})
          }
        ).finally(() => {
          this.listLoading = false
        })
      },
      userAdd(){
        this.dialogUserShow=true
      },
      tablespaceAdd(){
        if (this.addTablespaceForm.tablespace_type == 'Normal'){
          var addTablespaceSql = 'create tablespace ' + this.addTablespaceForm.tablespace_name + ' datafile \'' +
            this.defaultFileDirectory + this.addTablespaceForm.file_name + '\' size ' + this.addTablespaceForm.size +
            'G autoextend ' + this.addTablespaceForm.autoextend + ';'
        }else if(this.addTablespaceForm.tablespace_type == 'Undo'){
          var addTablespaceSql = 'create undo tablespace ' + this.addTablespaceForm.tablespace_name + ' datafile \'' +
            this.defaultFileDirectory + this.addTablespaceForm.file_name + '\' size ' + this.addTablespaceForm.size +
            'G autoextend ' + this.addTablespaceForm.autoextend + ';'
        }else if(this.addTablespaceForm.tablespace_type == 'Temp'){
          var addTablespaceSql = 'create temporary  tablespace ' + this.addTablespaceForm.tablespace_name + ' tempfile \'' +
            this.defaultFileDirectory + this.addTablespaceForm.file_name + '\' size ' + this.addTablespaceForm.size +
            'G autoextend ' + this.addTablespaceForm.autoextend + ';'
        }
        console.log(addTablespaceSql)
        this.execSql = addTablespaceSql
        this.dialogExecSqlShow = true
      },
      setDefaultFileDirectory(instId ,tablespaceType){
        this.defaultFileDirectory = '/data/oradata/'
      },
      killSession(){
        var mulSel = this.$refs.sessionMultipleTable.selection
        if(mulSel.length>0){
          this.execSql = '';
          for(var i=0;i<mulSel.length;i++){
            this.execSql = this.execSql + 'alter system kill session \'' + mulSel[i].sid + ','
              + mulSel[i].serial + '\' immediate;' + "<br/>"
          }
          this.dialogExecSqlShow = true
        }else{
          this.$message({type: 'warning',message: '您没有选中任何内容！'});
        }
      },
      onCopy(){
        this.$message.success('复制成功')
      },
      onError(){
        this.$message.console.error('复制失败');
      },
      createTimer(){
        this.timer = setInterval(() => {
          this.getInfo(this.instId, this.activeName);
        }, 5000);
      },
      stopReflash() {
        clearInterval(this.timer);
      },
      reflashClick () {
        if (this.status) {
          this.status = false;
          this.clickText = '5秒自动刷新'
          this.stopReflash()
        }else{
          this.status=true;
          this.clickText = '停止自动刷新'
          this.createTimer()
        }
      }
    },
    watch:{
      activeName:function(newVal, oldVal) {
        if(newVal!='session' && oldVal == 'session' && this.status == true){
          this.status = false;
          this.clickText = '5秒自动刷新'
          this.stopReflash()
        }
      }
    },
    mounted() {
      if (this.is_cluster == true){
        this.addTablespaceForm.file_name = '+DATA'
      }else{
        this.setDefaultFileDirectory(this.instId)
      }
      // console.log(this.instId)
    }
  }
</script>

<style scoped>
  .span {
    font-weight: bold;
    font-size:16px
  }
</style>
