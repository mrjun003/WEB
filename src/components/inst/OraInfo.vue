<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-divider><span class="title">主机信息</span></el-divider>
            <span class="span">主机名：{{ instInfo.host_name }}<br/></span>
            <span class="span">操作系统：{{ databaseInfo.platform_name }}<br/></span>
            <span class="span" v-for="info in hostInfoData">{{ info.stat_name }}：{{ info.value }}<br/></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-divider><span class="title">实例信息</span></el-divider>
            <span class="span">实例号：{{ instInfo.instance_number }}<br/></span>
            <span class="span">实例名：{{ instInfo.instance_name }}<br/></span>
            <span class="span">数据库版本：{{ instInfo.version }}<br/></span>
            <span class="span">启动时间：{{ instInfo.startup_time }}<br/></span>
            <span class="span">数据库状态：{{ instInfo.status }}<br/></span>
            <span class="span">归档模式：{{ instInfo.archiver }}<br/></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-divider><span class="title">数据库信息</span></el-divider>
            <span class="span">dbid：{{ databaseInfo.dbid }}<br/></span>
            <span class="span">数据库名：{{ databaseInfo.name }}<br/></span>
            <span class="span">创建时间：{{ databaseInfo.created }}<br/></span>
            <span class="span">日志模式：{{ databaseInfo.log_mode }}<br/></span>
            <span class="span">数据库角色：{{ databaseInfo.database_role }}<br/></span>
            <span class="span">数据状态：{{ databaseInfo.open_mode }}<br/></span>
            <span class="span">是否有备库：{{ databaseInfo.guard_status }}<br/></span>
            <span class="span">是否开启闪回功能：{{ databaseInfo.flashback_on }}<br/></span>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default {
    props: ['instId'],
    data(){
      return{
        listLoading:false,
        instInfo:{},
        databaseInfo:{},
        hostInfoData:[],
        flag:true,
      }
    },
    methods:{
      getDatabaseInfo(instId=this.instId){
        if (this.flag){
          this.flag = false
          this.listLoading = true
          this.$http.get('/api/inst/getinfo/', {
            params: {
              id: instId,
              tab: 'info',
            }
          }).then((res) => {
              this.instInfo = res.result.instanceinfodata[0];
              this.databaseInfo = res.result.databaseinfodata[0];
              this.hostInfoData = res.result.hostinfodata;
            this.listLoading = false;
            }, (response) => {
              this.$message({type: 'error',message: '获取信息失败，原因：' + response.result})
            }
          )
        }
      },
    },
    mounted(){
      this.getDatabaseInfo(this.instId)
    },
  }
</script>

<style scoped>
  .span{
    margin-bottom: 10px;
    margin-left: 20px;
  }
  .grid-content {
    padding-top:20px;
    border-radius: 4px;
    min-height: 100px;
    line-height: 35px;
  }
  .bg-purple {
    background: #ffffff;
  }
  .title{
    font-weight: bold;
    font-size:16px
  }
</style>
