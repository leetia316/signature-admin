import Cookies from 'js-cookie'

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
    Cookies.set(TOKEN_KEY, token, 1) //存一天
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
}
//节流函数，用于window onsize 滚动行为等
export const throttle = (method,content)=>{
    clearTimeout(method.tId);
    method.tId = setTimeout(()=>{
        method.call(content);
    },100)
}

export const log = (mes,data)=>{
    // (process.env.NODE_ENV === 'development')
    console.log(mes+':')
    console.log(data)
}

export const isRealNum = (val) => {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if (val === "" || val == null) {
        return false;
    }
    if (!isNaN(val)) {
        return true;
    } else {
        return false;
    }
}