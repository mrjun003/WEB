import Login from './components/Login.vue'
import Layout from './components/Layout.vue'
import Home from './components/Home.vue'
import inst_routes from './components/inst/routes'
import Mysqldetail from './components/inst/Mysqldetail.vue'
import Oradetail from './components/inst/Oradetail.vue'
import devops_routes from './components/devops/routes'


const routes = [
  {
    path: '',
    name: 'home',
    component: Home
  },
  {
    path: 'inst',
    routes: inst_routes
  },
  {
    path: 'devops',
    routes: devops_routes
  },
  {
    path: '*',
    redirect: '/'
  }
]


function load_route (routes) {
  let result = []
  for (let route of routes) {
    if (route.hasOwnProperty('routes') && Array.isArray(route.routes)) {
      for (let sub_route of load_route(route.routes)) {
        sub_route.path = '/' + route.path + '/' + sub_route.path
        result.push(sub_route)
      }
    } else {
      result.push(route)
    }
  }
  return result
}

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/detail/inst/oradetail',
    name: 'oradetail',
    component: Oradetail
  },
  {
    path: '/detail/inst/mysqldetail',
    name: 'mysqldetail',
    component: Mysqldetail
  },
  {
    path: '/',
    component: Layout,
    // redirect: '/home',
    children: load_route(routes)
  },
]
