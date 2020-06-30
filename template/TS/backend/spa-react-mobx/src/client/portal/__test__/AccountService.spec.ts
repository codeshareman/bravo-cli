import FeService from "../service/provider/AccountService";
import BeService from "../service/oss/AccountService";
import {http} from './http.spec'
const feService = new FeService(http)
const beService = new BeService(http)

describe('入驻审批', () => {
    test('入驻审批', async () => {
        const response = await feService.status();
        console.log(JSON.stringify(response));
        expect(response.code).toBe(0)
    }, 20000)
})