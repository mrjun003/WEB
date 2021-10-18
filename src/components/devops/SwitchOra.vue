<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-form :inline="true" :model="filters">
          <el-form-item label="IP：">
            <el-input v-model="filters.ip" placeholder="ip"></el-input>
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
    </el-row>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        filters:{
          ip:'',
          inst_name:'',
          app:'',
        },
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
