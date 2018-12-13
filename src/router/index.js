import Vue from 'vue'
import Router from 'vue-router'
import {routers} from "./routers";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from "../common/js/util";
import {Message} from 'iview'
import Toast from "vant/es/toast/index";

NProgress.configure({showSpinner: true, trickleRate: 0.03, trickleSpeed: 500})// NProgress Configuration

Vue.use(Router);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
};
const router = new Router(RouterConfig);
export default router
router.beforeEach((to, from, next) => {
    // NProgress.start();
    document.title = '西南管道电子签名系统';
    if(!getToken() && to.name ==='processList'){
        Message.error({
            content: '未登录，跳转登录...',
            duration: 1.5
        });
        next({name:'login'})
    }else if((to.name !=='processList' && to.name !=='login') && !localStorage.getItem("userInfo") && !getUrlParam("token")){
        alert("会话失效，请退出重新进入");
    }else {
        next()
    }

});

/*router.afterEach((to) => {
   setTimeout(function () {
           NProgress.done()
   },800)
});*/
function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function browserRedirect() {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    let bIsMidp = sUserAgent.match(/midp/i) == "midp";
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    let bIsAndroid = sUserAgent.match(/android/i) == "android";
    let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return "phone"
    } else {
        return "pc"
    }
}