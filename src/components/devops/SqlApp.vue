<template>
  <div>
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
        <el-col :span="12">
          <el-form-item label="数据库：" prop="db_name" required>
            <el-select v-model="addForm.db_name" placeholder="请选择">
              <el-option label="db01" value="db01">
              </el-option>
              <el-option label="db02" value="db02">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="SQL：" prop="sql" required>
            <SqlEditor ref="sqleditor"
                       :value="addForm.sql"
                       @changeTextarea="changeTextarea($event)"
                       style="line-height: 22px;"></SqlEditor>
          </el-form-item>
        </el-col>
      </el-row>
      <el-alert v-if="error" :title="error" type="error" style="margin-top: -10px; margin-bottom: 10px"
                show-icon></el-alert>
    </el-form>
    <div slot="footer">
      <el-row>
        <el-col :span="12">
          <el-button type="danger" @click.native="formaterSql (addForm.sql)">格式化SQL</el-button>
          <el-button type="primary"  @click.native="">获取优化建议</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="info" @click.native="addForm.sql=''">重置</el-button>
          <el-button type="primary" :loading="addLoading" @click.native="addSubmit">提交</el-button>
        </el-col>
      </el-row>
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
    data(){
      return{
        addLoading:false,
        error:'',
        addForm: {},
        rules: {
          db_address: [
            {required: true, message: '请选择数据库连接地址', trigger: 'blur'}
          ],
          db_name: [
            {required: true, message: '请选择数据库', trigger: 'blur'}
          ],
          sql: [
            {required: true, message: '请输入SQL', trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      changeTextarea (val){
        this.$set(this.addForm, 'sqlM', val)
      },
      formaterSql (val) {
        let dom = this.$refs.sqleditor
        dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()))
      },
    }
  }
</script>

<style scoped>

</style>
