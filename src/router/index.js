import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('../views/Projects.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('../views/Register.vue')
  // },

  // admin pages
  {
    path: '/admin/add-customer',
    name: 'AddCustomer',
    component: () => import('../views/admin/AddCustomer.vue')
  },

  // projects
  {
    path: '/projects/dns-resolver-overview',
    name: 'DnsResolverOverview',
    component: () => import('../views/projects/DnsResolverOverview.vue')
  },
  {
    path: '/projects/dns-resolver/:id',
    name: 'DnsResolver',
    component: () => import('../views/projects/DnsResolver.vue')
  },
  // {
  //   path: '/projects/dns-resolver-view2/:id',
  //   name: 'DnsResolverView2',
  //   component: () => import('../views/projects/DnsResolverView2.vue')
  // },
  {
    path: '/projects/dns-uploader/:id',
    name: 'DnsUploader',
    component: () => import('../views/projects/DnsUploader.vue')
  },

  // dev/debug
  {
    path: '/projects/test-layout',
    name: 'TestLayout',
    component: () => import('../views/projects/TestLayout.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  mode: 'hash' 
})

export default router
