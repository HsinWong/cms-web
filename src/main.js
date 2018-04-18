import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import Cookies from 'js-cookie';
import App from './app.vue';
import 'iview/dist/styles/iview.css';


Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);


const store = new Vuex.Store({
    state: {
        currentUser: {
            id: '',
            username: '',
            nickname: '',
        }
    },
    getters: {},
    mutations: {
        updateCurrentUser(state, user) {
            Vue.set(state.currentUser, 'id', user.id);
            Vue.set(state.currentUser, 'username', user.username);
            Vue.set(state.currentUser, 'nickname', user.nickname);
        }
    },
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
        if (Cookies.get('token')) {
            next({replace: true, name: 'index'});
        } else {
            next();
        }
    }
    else if (!Cookies.get('token')) {
        next({replace: true, name: 'login'});
    } else {
        Util.title(to.meta.title);
        next();
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
