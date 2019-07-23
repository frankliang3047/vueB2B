// 官方必須元件
import Vue from 'vue';
import Router from 'vue-router';
// 自定
import Dashboard from '@/components/pages/admin/Dashboard';
import Login from '@/components/pages/Login';
import Home from '@/components/pages/Home';
import Index from '@/components/pages/Index';
import Products from '@/components/pages/admin/Products';
import CustomerOders from '@/components/pages/CustomerOders';
import CardDetail from '@/components/pages/CardDetail';
import Checkout from '@/components/pages/Checkout';
import CheckoutInfo from '@/components/pages/CheckoutInfo';
import CheckoutPay from '@/components/pages/CheckoutPay';
import Orders from '@/components/pages/admin/Orders';
import MyOrders from '@/components/pages/MyOrders';
import Cart from '@/components/pages/Cart';
import Coupon from '@/components/pages/admin/Coupon';

Vue.use(Router)

export default new Router({
  // 切換路由時回到畫面頂部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '/',
          name: 'Index',
          component: Index,
        },
        {
          path: '/customerOders',
          name: 'CustomerOders',
          component: CustomerOders,
        },
        {
          path: '/cardDetail/:prodId',
          name: 'CardDetail',
          component: CardDetail,
        },
        {
          path: '/myOrders',
          name: 'MyOrders',
          component: MyOrders,
        },
        {
          path: '/cart',
          name: 'Cart',
          component: Cart,
        },
        {
          path: '/checkout',
          name: 'Checkout',
          component: Checkout,
          children: [
            {
              path: '/',
              name: 'CheckoutInfo',
              component: CheckoutInfo,
            },
            {
              path: '/checkoutPay/:orderID',
              name: 'CheckoutPay',
              component: CheckoutPay,
            }
          ]
        },
      ],
    },
    {
      path: '/login',
      name: 'Login,',
      component: Login,
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: Products,
          meta: { requiresAuth: true },
        },
        {
          path: 'orders',
          name: 'Orders',
          component: Orders,
          meta: { requiresAuth: true },
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: Coupon,
          meta: { requiresAuth: true },
        }
      ],
    },
  ]
})
