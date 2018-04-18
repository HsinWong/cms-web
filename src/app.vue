<template>
    <div class="fillPage">
        <router-view></router-view>
    </div>
</template>
<script>
    import Util from './libs/util';
    import Cookies from 'js-cookie';

    export default {
        data() {
            return {};
        },
        mounted() {
            Util.ajax.interceptors.response.use(response => {
                if (response.status === 403) {
                    Cookies.remove('token');
                    localStorage.clear();
                    this.$router.replace({name: 'login'});
                }
                return response;
            }, function (error) {
                return Promise.reject(error);
            });
        },
        beforeDestroy() {

        },
        methods: {}
    };
</script>
<style>
    html, body, .fillPage {
        width: 100%; height: 100%;
    }
</style>
