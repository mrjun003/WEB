import ViewSql from './ViewSql.vue';
import SqlApp from './SqlApp.vue'
import SlowSql from './SlowSql.vue'
import Binlog2Sql from './Binlog2Sql.vue'
import Install from './Install'
import Users from './Users'
import Databases from './Databases'
import SwitchOra from './SwitchOra'
import AnalyseAwr from './AnalyseAwr'
import CheckDb from './CheckDb'

export default [
  {
    path: 'viewsql',
    component: ViewSql,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'sqlapp',
    component: SqlApp,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'slowsql',
    component: SlowSql,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'binlog2sql',
    component: Binlog2Sql,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'install',
    component: Install,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'users',
    component: Users,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'databases',
    component: Databases,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'switchora',
    component: SwitchOra,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'analyseawr',
    component: AnalyseAwr,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },{
    path: 'checkdb',
    component: CheckDb,
    meta: {
      permission: 'devops_viewsql_view'
    }
  },
]
