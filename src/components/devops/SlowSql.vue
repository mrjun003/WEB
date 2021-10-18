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
          <el-form-item label="用户名：">
            <el-select v-model="filters.user" placeholder="请选择库">
              <el-option
                v-for="item in user_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="只SELECT：">
            <el-radio-group v-model="filters.only_select">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="全表扫描：">
            <el-radio-group v-model="filters.full_tab">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
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
          <el-form-item>
            <el-button type="primary" icon="search" @click="name_Search()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data (){
      return {
        filters:{
          user:'',
          full_tab:false,
          only_select:false,
          con_address:'',
          times:[new Date(), new Date()],
        },
        user_list:[
          {value: 'user01', label: 'user01'},
          {value: 'user02', label: 'user02'},
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

</style>
