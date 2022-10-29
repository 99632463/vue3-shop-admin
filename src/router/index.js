import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '~/layout/admin.vue'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import GoodsList from '~/pages/goods/list.vue'
import CategoryList from '~/pages/category/list.vue'
import UserList from '~/pages/user/list.vue'
import OrderList from '~/pages/order/list.vue'
import CommentList from '~/pages/comment/list.vue'
import ImageList from '~/pages/image/list.vue'
import NoticeList from '~/pages/notice/list.vue'
import SettingBase from '~/pages/setting/base.vue'
import CouponList from '~/pages/coupon/list.vue'
import ManagerList from '~/pages/manager/list.vue'
import AccessList from '~/pages/access/list.vue'

const routes = [
  {
    path: '/',
    component: Admin,
    children: [
      {
        path: '',
        component: Index,
        meta: {title: '后台首页'}
      },
      {
        path: '/goods/list',
        component: GoodsList,
        meta: {title: '商品管理'}
      },
      {
        path: '/category/list',
        component: CategoryList,
        meta: {title: '商品分类'}
      },
      {
        path: '/user/list',
        component: UserList,
        meta: {title: '用户列表'}
      },
      {
        path: '/order/list',
        component: OrderList,
        meta: {title: '订单列表'}
      },
      {
        path: '/comment/list',
        component: CommentList,
        meta: {title: '评价列表'}
      },
      {
        path: '/image/list',
        component: ImageList,
        meta: {title: '图库列表'}
      },
      {
        path: '/notice/list',
        component: NoticeList,
        meta: {title: '公告列表'}
      },
      {
        path: '/setting/base',
        component: SettingBase,
        meta: {title: '配置'}
      },
      {
        path: '/coupon/list',
        component: CouponList,
        meta: {title: '优惠卷列表'}
      },
      {
        path: '/manager/list',
        component: ManagerList,
        meta: {title: '管理员列表'}
      },
      {
        path: '/access/list',
        component: AccessList,
        meta: {title: '菜单权限'}
      }
    ]
  },
  {
    path: '/login',
    component: Login,
    meta: {title: '登录页'}
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router