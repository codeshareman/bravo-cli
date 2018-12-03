import axios from "@/api/base";

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

function testMock() {
    return axios({
        type: 'get',
        url: 'http://192.168.2.243:3000/mock/user',
    }); 
}

const poetry = {
    getRandomPoetry,
    testMock
}

export default poetry;