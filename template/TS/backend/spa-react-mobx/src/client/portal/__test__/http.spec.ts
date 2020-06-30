import {
    OssAccountService,
    OssAuthService,
    OssChannelStrategyService,
    OssOrderService,
    OssTempStrategyService,

    ProviderAccountService,
    ProviderCartService,
    ProviderContactService,
    ProviderFavoriteService,
    ProviderOrderService,
    ProviderProductService,
    ProviderPurchaseService,
    ProviderVerifyCodeService,
} from '../index'
import axios from "axios";

const feCookie = '4&_token=306279&F2C02186B9C84841B583DAD84BBEFC5DNdV04C1F7EBAA7314D394C7838A8C728EB5D5BC245A78D076573D2FD4A2D702C555'
const feUid = 306279
const beCookie = '4&_token=306279&F2C02186B9C84841B583DAD84BBEFC5DNdV04C1F7EBAA7314D394C7838A8C728EB5D5BC245A78D076573D2FD4A2D702C555'
const beUid = feUid
const http = axios.create({
    baseURL: 'http://qudao.test.ximalaya.com',
    headers: {
        Cookie: feCookie
    }
})
const providerHttp = axios.create({
    baseURL: 'http://qudao.test.ximalaya.com/portal-provider',
    headers: {
        Cookie: feCookie
    }
})
const ossHttp = axios.create({
    baseURL: 'http://qudao.test.ximalaya.com/portal-oss',
    headers: {
        Cookie: beCookie
    }
})
const feAcctService = new ProviderAccountService(http)
const feCartService = new ProviderCartService(http)
const feContactService = new ProviderContactService(http)
const feFavService = new ProviderFavoriteService(http)
const feOrderService = new ProviderOrderService(http)
const feProdService = new ProviderProductService(providerHttp)
const fePurchaseService = new ProviderPurchaseService(http)
const feVerifyService = new ProviderVerifyCodeService(providerHttp)

const beAcctService = new OssAccountService(ossHttp)
const beAuthService = new OssAuthService(ossHttp)
const beChannelService = new OssChannelStrategyService(ossHttp)
const beOrderService = new OssOrderService(ossHttp)
const beTempService = new OssTempStrategyService(ossHttp)

export {
    feUid,
    beUid,

    beAcctService,
    beAuthService,
    beChannelService,
    beOrderService,
    beTempService,

    feAcctService,
    feCartService,
    feContactService,
    feFavService,
    feOrderService,
    feProdService,
    fePurchaseService,
    feVerifyService
}