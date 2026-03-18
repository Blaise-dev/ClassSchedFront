import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: '/admin',
    name: 'admin-home',
    redirect: '/admin/dashboard',
    children: [
      {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: '/admin/classrooms',
        name: 'management-classroom',
        component: () => import("@/views/admin/management/ClassroomMangement.vue"),
      },
      {
        path: '/admin/reservations',
        name: 'management-reservation',
        component: () => import('@/views/admin/management/ReservationManagement.vue')
      },
      {
        path: '/admin/courses',
        name: 'management-course',
        component: () => import("@/views/admin/management/CourseManagement.vue"),
      },
      {
        path: '/admin/departments',
        name: 'management-department',
        component: () => import("@/views/admin/management/DepartmentManagement.vue"),
      },
      {
        path: '/admin/filieres',
        name: 'management-filiere',
        component: () => import("@/views/admin/management/FiliereManagement.vue"),
      },
      {
        path: '/admin/levels',
        name: 'management-level',
        component: () => import("@/views/admin/management/LevelManagement.vue"),
      },
      {
        path: '/admin/options',
        name: 'management-option',
        component: () => import("@/views/admin/management/OptionManagement.vue"),
      },
      {
        path: '/admin/teachers',
        name: 'management-teacher',
        component: () => import('@/views/admin/management/TeacherManagement.vue'),
      },
      {
        path: '/admin/time-table',
        name: 'time-table',
        component: () => import("@/views/admin/management/TimeTable.vue"),
      },
    ]
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/authentication/LoginView.vue')
  },
  {
    path: '/admin/register',
    name: 'admin-register',
    component: () => import('@/views/admin/authentication/RegisterView.vue')
  },
  {
    path: '/planning/',
    name: 'planning',
    component: () => import("@/views/Planning.vue")
  },
  {
    path: '/accueil/',
    name: 'accueil',
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: '/reservations/',
    name: 'reservations',
    component: () => import("@/views/Reservations.vue"),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let admin = null
  try {
    admin = JSON.parse(localStorage.getItem('admin') || 'null')
  } catch (error) {
    admin = null
  }
  const isLoggedIn = !!(admin && admin.token)
  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthPage = to.path === '/admin/login' || to.path === '/admin/register'
  const isPublicRoute = !isAdminRoute

  if ((isAdminRoute && !isAuthPage && !isLoggedIn) || (to.meta?.requiresAuth && !isLoggedIn)) {
    next('/admin/login')
    return
  }

  if (isLoggedIn && isAuthPage) {
    next('/admin/dashboard')
    return
  }

  if (isLoggedIn && isPublicRoute) {
    next('/admin/dashboard')
    return
  }

  next()
})

export default router