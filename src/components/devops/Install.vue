<template>
<div>
  <el-row :gutter="40">
    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Oracle 单机安装</span>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Oracle RAC安装</span>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Oracle ADG搭建</span>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="40">
    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Mysql 单机安装</span>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Mysql 主从安装</span>
      </div>
    </el-col>

    <el-col :span="8">
      <div class="inst-grid-content inst-bg-purple">
        <span class="inst-el-span">Mysql 主主安装</span>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
  export default {
    name: 'Install'
  }
</script>

<style scoped>
  .inst-grid-content {
    /*padding-top:20px;*/
    border-radius: 4px;
    min-height: 150px;
    line-height: 150px;/*让黄色div中的文字内容垂直居中*/
    text-align: center;/*让文字水平居中*/
  }

  .inst-bg-purple {
    background: #ffffff;
  }

  .inst-el-span {
    font-size:20px;
    font-weight: bold;
    color: #1890ff;
  }

  .el-row {
    margin-bottom: 20px;
  }
</style>
