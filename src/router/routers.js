import Main from "_v/Main.vue";

export const mainRouters = [
  {
    path: "/login",
    name: "login",
    meta: {
      keepAlive: false,
      title: "电子签名系统-登录",
    },
    component: () => import("_v/login.vue"),
  },
  {
    path: "/audit",
    name: "audit",
    meta: {
      keepAlive: false,
      title: "审批列表",
    },
    component: () => import("_v/mobile/auditList.vue"),
  },
  {
    path: "/myApply",
    name: "myApply",
    meta: {
      keepAlive: false,
      title: "我的申请",
    },
    component: () => import("_v/mobile/myApply.vue"),
  },
  {
    path: "/myApplyDetail",
    name: "myApplyDetail",
    meta: {
      keepAlive: false,
      title: "我的申请详情",
    },
    component: () => import("_v/mobile/myApplyDetail.vue"),
  },
  {
    path: "/auditListHistory",
    name: "auditListHistory",
    meta: {
      keepAlive: false,
      title: "历史审批列表",
    },
    component: () => import("_v/mobile/auditListHistory.vue"),
  },
  {
    path: "/toAudit",
    name: "toAudit",
    meta: {
      keepAlive: false,
      title: "单据详情",
    },
    component: () => import("_v/mobile/toAudit.vue"),
  },
  {
    path: "/sign",
    name: "toSign",
    meta: {
      keepAlive: false,
      title: "手写签名",
    },
    component: () => import("_v/mobile/toSign.vue"),
  },
  {
    path: "/createForm",
    name: "createForm",
    meta: {
      keepAlive: false,
      title: "创建申请",
    },
    component: () => import("_v/mobile/createForm.vue"),
  },
  {
    path: "/",
    name: "main",
    component: Main,
    meta: {
      title: "电子签名系统",
    },
    redirect: "/login",
    children: [
      /*  {
            path: '/index',
            name: 'index',
            meta: {
                keepAlive: true,
                title: '电子签名系统-首页'
            },
            component: () => import('_v/sign/index.vue')
        },*/
      {
        path: "/processList",
        name: "processList",
        meta: {
          keepAlive: false,
          title: "电子签名系统-流程列表",
        },
        component: () => import("_v/sign/processList.vue"),
      },
    ],
  },
];

export const routers = [
  ...mainRouters,
  // loginRouter,
  // demo_index,
  // demo_login
];
