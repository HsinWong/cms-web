import Util from "./libs/util";

const routers = [
    {
        path: '/',
        name: 'index',
        meta: {
            title: 'CMS内容管理系统'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    }, {
        path: '/login',
        name: 'login',
        meta: {
            title: 'CMS内容管理系统 - 登录'
        },
        beforeEnter: (to, from, next) => {
            Util.title(to.meta.title);
            next();
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    }
];
export default routers;
