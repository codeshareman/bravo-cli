import axios from "@SRC/api/base";
import Helper from '@SRC/utils/helper'
// /mock 本地mock环境
// const API_ENV = '/api';

// 获取当前收入和待结算
function getProfitSummary(data){
    data = data || {}
    return axios({
        type: 'post',
        url: '/revenue/summary',
        params: data,
    });
}

// 获取收益明细
function getProfitDetail(data) {
    return axios({
        type: 'get',
        url: '/revenue/detail',
        params: data
    }); 
}

// 获取单条收益详情
function downloadExcel(data) {
    return axios({
        type: 'get',
        url: '/revenue/detail/download',
        params: data
    });   
}

// 获取baner内容
function getBannerConten() {
    return axios({
        type: 'get',
        url: '/distributor/library'
    });   
}

const profit = {
    getProfitSummary,
    getProfitDetail,
    downloadExcel,
    getBannerConten
}

export default profit;