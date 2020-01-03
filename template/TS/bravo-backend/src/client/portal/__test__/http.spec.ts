import axios from "axios";
import AuthService from "../../common/AuthService";

export const http = axios.create({
    //baseURL: 'http://localhost:8080/party-oss/api/v1',
     baseURL: 'http://wws.test.ximalaya.com/wws-gateway/activity-oss/api/v1',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        // 通过 http://wws.test.ximalaya.com/wws-gateway/wws-cps-auth/api/login 返回的 data 数据
        'x-token': 'fb955f96714f6ffa3d2ae5832f4a16bafb8f67c5',
        // 通过 http://wws.test.ximalaya.com/wws-gateway/wws-cps-auth/api/login 拿到的 cookie
        Cookie: '4&_wws_token=306279&eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyUmVmIjoie1widWlkXCI6MzA2Mjc5LFwidU5hbWVcIjpcIjE4NjQwMjBpeGVtXCIsXCJ1c2VySWRcIjoxLFwicmVhbE5hbWVcIjpcIuWImOa2m1wiLFwidXNlckhlYWRcIjpcImh0dHA6Ly9mZGZzLnhtY2RuLmNvbS9ncm91cDU3L00wNS8wMy9GOS93S2dMZ1Z4MlVDdVJOX1FrQUFBSnJ0SWctMFkwNDQucG5nXCIsXCJyb2xlVHlwZVwiOlwiSU5ORVJcIixcImFkZHJlc3NcIjpudWxsLFwiZm9yYmlkZGVuXCI6ZmFsc2UsXCJzY2VuZXNcIjpudWxsLFwiYWdlbnRUeXBlXCI6bnVsbCxcIm9yZ0lkXCI6bnVsbCxcImFnZW50TGV2ZWxcIjpudWxsLFwic3VwZXJBZG1pblwiOnRydWV9IiwiZXhwIjoxNTYxNjI5MDQzfQ.W5SqQTyqwz8Il8wuKDhJmc4L5d-AJJc3Uq2iztVDVIQ'
    }
})


const user = '18613234020'
const pswd = 'y123456'

// 登录主站
export async function loginCps() {
    let httpBase = axios.create({
        baseURL: 'http://wws.test.ximalaya.com'
    })
    let client = new AuthService(httpBase)
    let wws_cookie = await client.login(user, pswd)
    console.log("cookie: " + wws_cookie);
    console.log("x-token:   " + httpBase.defaults.headers['x-token'])

    Object.assign(http.defaults.headers, {
        'Content-Type': 'application/json;charset=utf-8',
        // 通过 http://wws.test.ximalaya.com/wws-gateway/wws-cps-auth/api/login 返回的 data 数据
        'x-token': httpBase.defaults.headers['x-token'],
        // 通过 http://wws.test.ximalaya.com/wws-gateway/wws-cps-auth/api/login 拿到的 cookie
        Cookie: wws_cookie
    })
}