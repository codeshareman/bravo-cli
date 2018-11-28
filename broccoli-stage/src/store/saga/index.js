
import { getRandomPoetry } from '@/store/saga/user' 


export default function* rootSaga() {
    yield all([
        getRandomPoetry() 
    ]);
}
