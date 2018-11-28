import axios from "./base";

/**
 * @msg: 随机请求一首诗
 * @param {type} 
 * @return
 */
function getRandomPoetry(data){
    data = data || {}
    return axios({
        type: 'get',
        url: '/api/searchAuthors',
        params: data
    });
}


const poetry = {
    getRandomPoetry
}

export default poetry;