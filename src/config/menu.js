let menu = {
  menus: [
    {
      key: '/home', desc: 'Dashboard', icon: 'el-icon-s-platform', permission: 'home_view',
    },
    // {
    //   key: '/install/install', desc: '数据库安装', icon: 'el-icon-coin', permission: 'assets_host_view|assets_host_exec_view',
    // },
    {
      key: '/inst/instance', desc: '实例列表', icon: 'el-icon-coin', permission: 'inst_view',
    },
    {
      key: '1', desc: '数据库运维', icon: 'el-icon-s-tools', permission: 'devops_view', subs: [
        {key: '/devops/databases', permission: 'devops_db_view', desc: '数据同步'},
        // {key: '/devops/users', permission: 'devops_user_view', desc: '用户管理'},
        {key: '/devops/viewsql', permission: 'devops_sql_view', desc: 'SQL上线申请'},
        {key: '/devops/binlog2sql', permission: 'devops_binlog_view', desc: '解析Binlog'},
        {key: '/devops/slowsql', permission: 'devops_slow_view', desc: 'Mysql主节点切换'},
        {key: '/devops/analyseawr', permission: 'devops_awr_view', desc: 'AWR报告分析'},
        {key: '/devops/checkdb', permission: 'devops_checkdb_view', desc: '数据库巡检'},
        // {key: '/devops/backup', permission: 'inst_test_view', desc: '数据库备份'},
        // {key: '/devops/transferdata', permission: 'inst_test_view', desc: '数据导出&迁移'},
        {key: '/devops/switchora', permission: 'checkdb_switchora_view', desc: 'ADG主备切换'},
        // {key: '/devops/switchmysql', permission: 'inst_test_view', desc: 'Mysql主从切换'},
        {key: '/devops/install', permission: 'switchora_install_view', desc: '数据库安装'},
      ]
    },
    {
      key: '2', desc: '定时任务', icon: 'el-icon-date', permission: 'cron_view', subs: [
        {key: '/cron/checkdb', permission: 'cron_checkdb_view', desc: '巡检'},
        {key: '/cron/backup', permission: 'cron_backup_view', desc: '备份'},
        {key: '/cron/getawr', permission: 'cron_getawr_view', desc: '获取awr'},
        {key: '/cron/getslowsql', permission: 'cron_getslowsql_view', desc: '获取慢查'},
      ]
    },
    // {
    //   key: '5', desc: '任务管理', icon: 'fa fa-calendar', permission: 'job_task_view', subs: [
    //     {key: '/schedule/job', permission: 'job_task_view', desc: '任务列表'}
    //   ]
    // }, {
    //   key: '6', desc: '监控管理', icon: 'fa fa-tachometer', subs: [
    //     {key: 'host_monitor', desc: '主机监控'},
    //     {key: 'ser_monitor', desc: '服务监控'},
    //     {key: 'site_monitor', desc: '站点监控'},
    //   ]
    // },
    // {
    //   key: '7', desc: '告警管理', icon: 'fa fa-bell-o', subs: [
    //     {key: 'alarm_role', desc: '报警规则'},
    //     {key: 'alarm_contact', desc: '报警联系人'},
    //   ]
    // },
    // {
    //   key: '8', desc: '系统管理', icon: 'el-icon-setting',  permission: 'system_notify_view',  subs: [
    //     {key: '/system/notify', permission: 'system_notify_view', desc: '通知设置'},
    //   ]
    // },
  ]
}

export default menu
