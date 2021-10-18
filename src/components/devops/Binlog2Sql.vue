<template>
    <div>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="filters">
            <el-form-item label="数据库连接地址：" prop="con_address" required >
              <el-select v-model="filters.con_address" placeholder="请选择连接地址">
                <el-option
                  v-for="item in con_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库名：">
              <el-select
                v-model="filters.db_names"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择库">
                <el-option
                  v-for="item in db_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="表名：">
              <el-select
                v-model="filters.tab_names"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择表">
                <el-option
                  v-for="item in tab_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="只解析dml：">
              <el-radio-group v-model="filters.only_dml">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="SQL类型：">
              <el-select
                v-model="filters.sql_types"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择解析类型">
                <el-option label="INSERT" value="INSERT">
                </el-option>
                <el-option label="UPDATE" value="UPDATE">
                </el-option>
                <el-option label="DELETE" value="DELETE">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间：" required>
              <el-date-picker
                v-model="filters.times"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="生成回滚SQL：">
              <el-radio-group v-model="filters.is_flash_sql">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div align="center">
        <el-input type="textarea" :rows="17" placeholder="" v-model="sql" :readonly="true">
        </el-input>
        <el-button type="primary" icon="search" class="el-btn" @click="copy_sql()" :disabled="true">复制</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    data(){
      return{
        filters:{
          con_address:'',
          db_names:[],
          tab_names:[],
          times:[new Date(), new Date()],
          is_flash_sql:false,
          only_dml:true,
          sql_types:[],
        },
        sql:'',
        db_list:[
          {value: 'db01', label: 'db01'},
          {value: 'db02', label: 'db02'},
          {value: 'db03', label: 'db03'},
        ],
        tab_list:[
          {value: 'tab01', label: 'tab01'},
          {value: 'tab02', label: 'tab02'},
          {value: 'tab03', label: 'tab03'},
        ],
        con_list:[
          {value: '192.168.8.152:3306', label: '192.168.8.152:3306'},
          {value: '192.168.8.153:3306', label: '192.168.8.153:3306'},
        ],
      }
    }
  }
</script>

<style scoped>
  .el-btn {
    margin-top: 15px;
  }
</style>
