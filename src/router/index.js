import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import History from '@/components/History'
import Setting from '@/components/Setting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/history',
      name: 'History',
      component: History
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    }
  ]
})
