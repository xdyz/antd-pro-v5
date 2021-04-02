export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          }
        ]
      }
    ]
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'icon-shujukanban',
    component: './Welcome',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  // {
  //   path: '/taskPipeline',
  //   name: 'taskPipeline',
  //   icon: 'icon-survey1',
  //   routes: [
  //     {
  //       path: '/taskPipeline',
  //       redirect: '/taskPipeline/infinite'
  //     },
  //     {
  //       path: 'infinite',
  //       name: 'infinite',
  //       component: './taskPipeline/taskInfinite'
  //     },
  //     {
  //       path: 'taskDetail/:task_id',
  //       name: 'taskDetail',
  //       hideInMenu: true,
  //       component: './taskPipeline/taskDetail'
  //     },
  //     {
  //       path: ':task_id/constructDetail/:build_id',
  //       name: 'constructDetail',
  //       hideInMenu: true,
  //       component: './taskPipeline/constructDetail'
  //     }
  //   ]
  // },
  // {
  //   path: '/toolbox',
  //   icon: 'icon-tools-hardware',
  //   name: 'toolbox',
  //   routes: [
  //     {
  //       path: '/toolbox',
  //       redirect: '/toolbox/f2tb'
  //     },
  //     {
  //       path: 'f2tb',
  //       name: 'f2tb',
  //       component: './toolbox/f2tb'
  //     }
  //   ]
  // },
  {
    path: '/system',
    icon: 'icon-set',
    name: 'system',
    routes: [
      {
        path: '/system',
        redirect: '/system/users'
      },
      {
        path: 'users',
        name: 'users',
        component: './system/users'
      },
      {
        path: 'roles',
        name: 'roles',
        component: './system/role'
      },
      {
        path: 'menus',
        name: 'menus',
        component: './system/menus'
      },
      // {
      //   path: 'webhooks',
      //   name: 'webhooks',
      //   access: 'canAdmin',
      //   component: './system/webhook'
      // },
      {
        component: './404'
      }
    ]
  },
  {
    component: './404',
  }
];
