import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';


Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);


const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {}
});


// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();

    if (to.name === 'login') {
        next();
    }
    else {
        let tokenExpires = localStorage.getItem(Util.storageKey.tokenExpires);
        if (tokenExpires && tokenExpires > (new Date().getTime() / 1000)) {
            Util.title(to.meta.title);
            next();
        } else {
            localStorage.clear();
            next({replace: true, name: 'login'});
        }
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
