<template>
    <div>
      <el-row>
        <el-col :span="17">
          <el-form :inline="true" :model="filters">
            <el-form-item label="IP：">
              <el-input v-model="filters.ip" placeholder="ip"></el-input>
            </el-form-item>
            <el-form-item label="实例名：">
              <el-input v-model="filters.inst_name" placeholder="实例名"></el-input>
            </el-form-item>
            <el-form-item label="状态：">
              <el-select v-model="filters.status" placeholder="请选择">
                <el-option label="成功" value="成功"></el-option>
                <el-option label="失败" value="失败"></el-option>
                <el-option label="分析中" value="分析中"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分析时间：">
              <el-date-picker type="date" placeholder="选择日期" v-model="filters.apply_time" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="7" style="text-align: right">
          <el-button @click="refresh()">刷新</el-button>
          <el-button type="primary" @click="handleAdd()">上传AWR</el-button>
          <el-button type="success" @click="handleAdd1()">生成AWR</el-button>
        </el-col>
      </el-row>

      <el-table :data="tableData.data" stripe border v-loading="listLoading" style="width: 100%">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="ip" label="IP" sortable></el-table-column>
        <el-table-column prop="inst_name" label="实例名" sortable></el-table-column>
        <el-table-column prop="file_name" label="文件名" sortable></el-table-column>
        <el-table-column prop="status" label="状态" sortable>
          <template slot-scope="scope">
            <el-tag :type="(scope.row.status == '成功' ? 'success' :
          (scope.row.status == '失败' ? 'danger' :'warning'))" size="medium">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tip" label="提示数"></el-table-column>
        <el-table-column prop="warning" label="警告数"></el-table-column>
        <el-table-column prop="danger" label="严重数"></el-table-column>
        <el-table-column prop="analyse_time" label="分析时间" sortable width="160px"></el-table-column>
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

      <el-dialog :title="addFormTitle" visible v-if="dialogShow" @close="dialogShow = false"
                 :close-on-click-modal="false" width="60%" append-to-body>
        <div align="center">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false">
            <el-button slot="trigger" type="primary">选取文件</el-button>
          </el-upload>
        </div>
        <div slot="footer">
          <el-button type="text" @click.native="dialogShow = false">取消</el-button>
          <el-button type="primary" :loading="addLoading" @click.native="addSubmit">上传并分析</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="addFormTitle1" visible v-if="dialog1Show" @close="dialog1Show = false"
                 :close-on-click-modal="false" width="60%" append-to-body>
          <el-form ref="addForm" :model="addForm" :rules="rules" label-width="135px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="IP：" prop="ip" required >
                  <el-select v-model="addForm.ip" placeholder="请选择">
                    <el-option
                      v-for="item in ip_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="时间段：">
                  <el-date-picker
                    v-model="addForm.times"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"
                      show-icon></el-alert>
          </el-form>
        <div slot="footer">
          <el-button type="text" @click.native="dialogShow = false">取消</el-button>
          <el-button type="primary" :loading="addLoading1" @click.native="addSubmit">生成并分析</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    data(){
      return{
        fileList:[],
        filters:{
          ip:'',
          inst_name:'',
          status:'',
        },
        addForm:{
          ip:'',
          times:[new Date(),new Date()]
        },
        tableData:{
          data:[
            {ip:'192.168.8.153',inst_name:'smtbdb1',file_name:'awrrpt_1_32400_32401.html',status:'成功',tip:3,warning:10,danger:5,analyse_time:'2021-09-24 15:30:20'},
            {ip:'192.168.8.153',inst_name:'smtbdb1',file_name:'awrrpt_1_32400_32401.html',status:'失败',tip:3,warning:10,danger:5,analyse_time:'2021-09-24 15:30:20'},
            {ip:'192.168.8.153',inst_name:'smtbdb1',file_name:'awrrpt_1_32400_32401.html',status:'分析中',tip:3,warning:10,danger:5,analyse_time:'2021-09-24 15:30:20'},
          ],
          total:5
        },
        listLoading:false,
        dialogShow:false,
        dialog1Show:false,
        ip_list:[{lable:'192.168.8.152',value:'192.168.8.152'},{lable:'192.168.8.153',value:'192.168.8.153'}],
        addLoading1:false,
        addLoading:false,
        error:'',
        rules:{
          ip: [
            {required: true, message: '请选择数据库连接地址', trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleAdd(){
        this.addFormTitle = '上传AWR报告',
          this.dialogShow = true
      },
      handleAdd1(){
        this.addFormTitle1 = '生成AWR报告',
          this.dialog1Show = true
      }
    }
  }
</script>

<style scoped>

</style>
