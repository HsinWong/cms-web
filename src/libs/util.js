import axios from 'axios';
import env from '../config/env';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

let util = {};
util.title = function (title) {
    title = title ? title : '未命名';
    window.document.title = title;
};

util.storageKey = {
    authorization: 'Authorization',
    userId: 'userId',
    tokenExpires: 'tokenExpires',
};

const ajaxUrl = env === 'development' ?
    'http://localhost:8081/api' :
    env === 'production' ?
        'https://www.url.com' :
        'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
});

util.ajaxSetAuthorization = function () {
    let token = Cookies.get('token');
    if (token) {
        util.ajax.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
};
util.ajaxSetAuthorization();

util.getTokenInfo = function () {
    let token = Cookies.get('token');
    if (token) {
        return jwtDecode(token);
    }
}

export default util;
