<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span class="el-span">总实例<br></span>
          <a class="el-a" href="">{{ total_inst }}</a>&nbsp;个
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span class="el-span">Oracle实例<br></span>
          <a class="el-a" href="">{{ ora_inst }}</a>&nbsp;个
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span class="el-span">Mysql实例<br></span>
          <a class="el-a" href="">{{ mysql_inst }}</a>&nbsp;个
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span class="el-span">其他实例<br></span>
          <a class="el-a" href="">{{ other_inst }}</a>&nbsp;个
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        total_inst:132,
        ora_inst:23,
        mysql_inst:63,
        other_inst:46,
      }
    }
  }
</script>
<style>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #ffffff;
  }
  .bg-purple-light {
    background: #ffffff;
  }
  .grid-content {
    padding-top:20px;
    border-radius: 4px;
    min-height: 100px;
    line-height: 35px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .el-a {
    margin-left: 35px;
    font-size:20px;
    color: #1890ff;
    text-decoration:none;
  }
  .el-span {
    margin-left: 35px;
    font-size:14px;
    color: #9a9fa1;
  }
</style>
