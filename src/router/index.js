import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '',
    name: 'home',
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: '/admin',
    name: 'admin-home',
    redirect: '/admin/time-table',
    children: [
      {
        path: '/admin/classrooms',
        name: 'management-classroom',
        redirect: '/admin/classrooms/create',
        component: () => import("@/views/admin/management/ClassroomMangement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-classroom',
            component: () => import("@/views/admin/forms/CreateClassroom.vue"),
          },
          {
            path: 'update',
            name: 'update-classroom',
            component: () => import("@/views/admin/forms/UpdateClassroom.vue"),
          },
        ]
      },
      {
        path: '/admin/reservations',
        name: 'management-reservation',
        component: () => import('@/views/admin/management/ReservationManagement.vue')
      },
      {
        path: '/admin/courses',
        name: 'management-course',
        redirect: '/admin/courses/create',
        component: () => import("@/views/admin/management/CourseManagement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-course',
            component: () => import("@/views/admin/forms/CreateCourse.vue")
          },
          {
            path: 'update',
            name: 'update-course',
            component: () => import("@/views/admin/forms/UpdateCourse.vue")
          },
        ]
      },
      {
        path: '/admin/departments',
        name: 'management-department',
        redirect: '/admin/departments/create',
        component: () => import("@/views/admin/management/DepartmentManagement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-department',
            component: () => import("@/views/admin/forms/CreateDepartment.vue")
          },
          {
            path: 'update',
            name: 'update-department',
            component: () => import("@/views/admin/forms/UpdateDepartment.vue")
          },
        ]
      },
      {
        path: '/admin/filieres',
        name: 'management-filiere',
        redirect: '/admin/filieres/create',
        component: () => import("@/views/admin/management/FiliereManagement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-filiere',
            component: () => import("@/views/admin/forms/CreateFiliere.vue")
          },
          {
            path: 'update',
            name: 'update-filiere',
            component: () => import("@/views/admin/forms/UpdateFiliere.vue")
          },
        ]
      },
      {
        path: '/admin/levels',
        name: 'management-level',
        redirect: '/admin/levels/create',
        component: () => import("@/views/admin/management/LevelManagement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-level',
            component: () => import("@/views/admin/forms/CreateLevel.vue")
          },
          {
            path: 'update',
            name: 'update-level',
            component: () => import("@/views/admin/forms/UpdateLevel.vue")
          },
        ]
      },
      {
        path: '/admin/options',
        name: 'management-option',
        redirect: '/admin/options/create',
        component: () => import("@/views/admin/management/OptionManagement.vue"),
        children: [
          {
            path: 'create',
            name: 'create-option',
            component: () => import("@/views/admin/forms/CreateOption.vue")
          },
          {
            path: 'update',
            name: 'update-option',
            component: () => import("@/views/admin/forms/UpdateOption.vue")
          },
        ]
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
    component: () => import("@/views/Reservations.vue")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const admin = JSON.parse(localStorage.getItem('admin') || 'null')
  const isLoggedIn = !!(admin && admin.token)
  const isAdminRoute = to.path.startsWith('/admin')
  const isAuthPage = to.path === '/admin/login' || to.path === '/admin/register'

  if (isAdminRoute && !isAuthPage && !isLoggedIn) {
    next('/admin/login')
    return
  }

  next()
})

export default router