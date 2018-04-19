import Util from "./libs/util";

const routers = [
    {
        path: '/',
        name: 'index',
        beforeEnter: (to, from, next) => {
            Util.title(to.meta.title);
            next();
        },
        component: (resolve) => require(['./views/index.vue'], resolve),
        children: [
            {
                path: '/profile',
                name: 'profile',
                meta: {
                    title: '个人信息',
                    icon: 'person',
                },
                components: {
                    profile: (resolve) => require(['./views/profile.vue'], resolve),
                },
            },
        ],
    }, {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        beforeEnter: (to, from, next) => {
            Util.title(to.meta.title);
            next();
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }
];
export default routers;
