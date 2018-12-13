import Axios from 'axios'
import {Message,Modal} from 'iview'
import Cookies from 'js-cookie'
import {TOKEN_KEY, log, getToken} from './util'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '../../router'
NProgress.configure({ showSpinner: true ,trickleRate: 0.03, trickleSpeed: 500 })// NProgress Configuration
Message.config({
    top: 55,
    duration: 2.5
});
Message.config({
    duration:5
})

const baseURL = '/rxswt'
const TimeOut = 10000

class httpRequest {
    constructor() {
        this.options = {
            method: 'Get', //默认get
            url: ''
        }
        // 存储请求队列
        this.queue = {}
    }

    // 销毁请求实例
    destroy(url) {
        delete this.queue[url]
        return this.queueHas(url)
    }
    queueHas(url){
        return this.queue.hasOwnProperty(url)
    }
    // 请求拦截
    interceptors(instance, url) {
        // 添加请求拦截器
        instance.interceptors.request.use(config => {
            // if (!config.url.includes('/users')) {
            //     config.headers['x-access-token'] = Cookies.get(TOKEN_KEY)
            // }
            // Spin.show()
            // 在发送请求之前做些什么

            return config
        }, error => {
            log('请求：'+url+'发生错误',error)
            // 对请求错误做些什么
            return Promise.reject(error)
        })

        // 添加响应拦截器
        instance.interceptors.response.use((res) => {
            NProgress.done()
            let {data} = res
            const is = this.destroy(url) //
            if (!is) {
                setTimeout(() => {
                    // Spin.hide()
                }, 500)
            }
            if (data.success) {
                return data
            }else {
                // 后端服务在个别情况下回报201，待确认
                // if (data.code === 401) {
                //     Cookies.remove(TOKEN_KEY)
                //     window.location.href = '/#/login'
                //     Message.error('未登录，或登录失效，请登录')
                // } else {
                //     if (data.msg) Message.error(data.msg)
                // }
                if (data.message) Message.error(data.message)
                return false
            }

        }, (error) => {
            NProgress.done();
            log('响应：'+url+'发生错误',error)
            Message.error('服务请求错误,无网络或服务器响应出错：'+error)
            // 对响应错误做点什么
            return Promise.reject(error)
        })
    }

    // 创建实例
    create(type) {
        NProgress.start()
        let conf = {
            baseURL: baseURL,
            timeout: TimeOut,
            headers: {
                'Content-Type': type === 'Post'?'application/x-www-form-urlencoded':'application/json; charset=utf-8',
                'X-URL-PATH': location.pathname
            }
        }
        return Axios.create(conf)
    }

    // 合并请求实例
    mergeReqest(instances = []) {
        //
    }

    // 请求实例
    Get(url,params) {
        if (url.includes('needId')) {
            url = url.substring(7);
            let Token = getToken();
            if(Token){
                params.userId = Token
            }else{
                Modal.confirm({
                    title: '提示',
                    content: '<p>您未登录，不能进行此操作，是否跳转登录？</p>',
                    onOk: () => {
                        // this.$Message.info('Clicked ok');
                        // console.log(router)
                        router.push({name:'login'})
                        // window.location.href = '/login'

                    },
                    onCancel: () => {
                        // this.$Message.info('Clicked cancel');
                    }
                });
                return Promise.reject(false)
            }
        }
        let instance = this.create('Get')
        this.interceptors(instance, url)
        const options = Object.assign({}, {url:url,params:params,method:'get'})
        this.queue[options.url] = instance
        return instance(options)
    }
    Post(url,data) {
        let instance = this.create('Post')
        this.interceptors(instance, url)
        const options = Object.assign({}, {url:url,data:data,method:'post'})
        this.queue[options.url] = instance

        return instance(options)
    }

}

const $Axios = new httpRequest();
export default {
    install: (Vue, options) => {
        Vue.prototype.Axios = $Axios
    }
}
