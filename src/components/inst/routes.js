import Instance from './Instance.vue';
import Detail from './Detail.vue';
import Oradetail from './Oradetail.vue'
import Mysqldetail from './Mysqldetail.vue'

export default [
  {
    path: 'detail',
    component: Detail,
    meta: {
      permission: 'inst_detail_view'
    }
  },
  {
    path: 'instance',
    component: Instance,
    meta: {
      permission: 'inst_inst_view'
    }
  },
  {
    path: 'mysqldetail',
    component: Mysqldetail,
    meta: {
      permission: 'inst_detail_view'
    }
  },
  {
    path: 'oradetail',
    component: Oradetail,
    meta: {
      permission: 'inst_detail_view'
    }
  },
]
